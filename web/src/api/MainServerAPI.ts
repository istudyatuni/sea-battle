import { removeYID } from 'components/Buttons/ButtonFunctions'
import { getString } from 'components/Translation/String'
import { handleMovesWS } from './BattleAPI'
import { delay, togglePopup, AllShips } from 'components/App/AppFunctions'
import { config } from 'config'

export const SendShips = async (ships: AllShips,
                                setID: (arg0: string)=>void,
                                opID: string,
                                setOpID: (arg0: string)=>void,
                                setField: (arg0: number, arg1: number, arg2: number)=>void) => {
  const response = await fetch(config.apiPrefix + '/ships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      opponent: opID,
      field: ships.field,
      total: ships.total,
      len:   ships.len
    })
  });

  if(response.ok) {
    let resp = await response.json() as {
      id: string;
      opponentID: string;
    }
    setID(resp.id)
    if(resp.opponentID !== "0") {
      // successfully start game
      togglePopup(true, "success", getString('good_game'))
      setTimeout(function(){ removeYID() }, 30)
      handleMovesWS(resp.id, setField)
      scrollTop()
    } else {
      togglePopup(true, "info", getString('please_wait'))
      getOpponentID(resp.id, setOpID, setField)
    }
  } else {
    // server unavailable
    togglePopup(true, "error", getString('server_unavailable'))
    console.error('Failed, response status: ', response.status)
  }
}

// we don't need wss://
export const wsURL = 'ws://' + window.location.host

export const getOpponentID = (id: string,
                              setOpID: (arg0: string)=>void,
                              setField: (arg0: number, arg1: number, arg2: number)=>void) => {
  let url = wsURL + '/ws/opponent/' + id
  let ws = new WebSocket(url)
  sendLog('url=' + url, '')
  let byClient = false
  ws.onmessage = ({data}) => {
    let json = JSON.parse(data)

    if(json.opponentID!=="0") {
      setOpID(json.opponentID)
      byClient = true
      ws.close(1000, 'No need more')

      togglePopup(true, 'success', getString('good_game'))
      setTimeout(function(){ togglePopup(true, 'success', getString('move')) }, 1000)

      handleMovesWS(id, setField)
      removeYID()
      scrollTop()
    }
  }
  ws.onerror = (e) => {
    sendLog('WebSocket error, id=' + id + ', downgrade to polling', e)
    console.error('WebSocket failed: ', e, 'downgrade to polling')
    getOpponentIDpoll(id, setOpID, setField)
    // it not by client, but we need to handle it
    byClient = true
  }
  ws.onclose = (e) => {
    if(byClient === false) {
      togglePopup(true, 'warn', getString('one_minute_timeout'))
      console.error('WebSocket closed', e)
    }
  }
}

export const getOpponentIDpoll = async (id: string,
                                        setOpID: (arg0: string)=>void,
                                        setField: (arg0: number, arg1: number, arg2: number)=>void) => {
  let timeout = 60
  let timer = 0
  let setID = '0'
  let url = config.apiPrefix + '/opponent?id=' + id
  while(timer < timeout) {
    timer++
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if(response.status === 200) {
      // get response, handle
      let resp = await response.json() as {
        opponentID: string;
      }
      setID = resp.opponentID
      if(setID !== '0') {
        // opponent ID is correct
        timer = timeout
        setOpID(setID)
      } else {
        // incorrect, wait 1 sec
        await delay(1000)
      }
    } else {
      // server unavailable
      timer = timeout
      togglePopup(true, 'error', getString('server_unavailable'))
      console.log('Failed to polling, response status: ', response.status)
      return
    }
  }
  if(setID !== '0') {
    togglePopup(true, 'success', getString('good_game'))
    setTimeout(function(){ togglePopup(true, "success", getString('move')) }, 1000)
    handleMovesWS(id, setField)
    scrollTop()
  }
  else {
    togglePopup(true, 'warn', getString('one_minute_timeout'))
  }
}

export const sendLog = async (message: string, e: any = '') => {
  let data = {
    message: message,
    error: {
      message: e['message'],
      arguments: e['arguments'],
      type: e['type'],
      name: e['name'],
    },
  }
  let url = config.apiPrefix + '/log'
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export const scrollTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
