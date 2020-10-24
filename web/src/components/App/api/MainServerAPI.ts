import { delay, togglePopup, removeYID } from '../AppFunctions'
import { getString } from '../../Translation/String'
import { handleMovesWS } from './BattleAPI'

export const SendShips = async (ships: number[][], setID: (arg0: string)=>void,
  opID: string, setOpID: (arg0: string)=>void, refresh: (arg0: number)=>void) => {
  const response = await fetch('/ships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ opponent: opID, ships: ships }),
  });

  if(response.ok) {
    let resp = await response.json() as {
      id: string;
      opponentID: string;
    }
    setID(resp.id)
    if(resp.opponentID!=="0") {
      // successfully start game
      togglePopup(true, "success", getString('good_game'))
      setTimeout(function(){ removeYID() }, 30)
      handleMovesWS(resp.id)
    } else {
      togglePopup(true, "info", getString('please_wait'))
      getOpponentID(resp.id, setOpID, refresh)
    }
  } else {
    // server unavailable
    togglePopup(true, "error", getString('server_unavailable'))
    console.error('Failed, response status: ', response.status)
  }
}

export const getOpponentID = (id: string, setOpID: (arg0: string)=>void, refresh: (arg0: number)=>void) => {
  let ws = new WebSocket('ws://localhost:4000/ws/opponent/' + id)
  let byServer = false
  ws.onopen = () => {
    ws.send(JSON.stringify({ "id": id }))
  }
  ws.onmessage = ({data}) => {
    let json = JSON.parse(data)
    if(json.opponentID!=="0") {
      setOpID(json.opponentID)
      ws.close(1000, 'No need more')
      togglePopup(true, "success", getString('good_game'))
      setTimeout(function(){ togglePopup(true, "success", getString('your_move')) }, 1000)
      handleMovesWS(id)
      removeYID()
    } else {
      // one minute server timeout
      togglePopup(true, "warn", getString('one_minute_timeout'))
      ws.close(1000, 'Timeout by server')
    }
    byServer = true
  }
  ws.onerror = (e) => {
    sendLog('WebSocket error, id=' + id + ', downgrade to polling', e)
    console.error('WebSocket failed: ', e, 'downgrade to polling')
    getOpponentIDpoll(id, setOpID)
    // it not by server, but we need handle it
    byServer = true
  }
  ws.onclose = (e) => {
    if(byServer===false) {
      // server unavailable
      togglePopup(true, 'error', getString('ws_closed'))
      console.error('WebSocket closed', e)
    }
  }
}

export const getOpponentIDpoll = async (id: string, setOpID: (arg0: string)=>void) => {
  let timeout = 60
  let timer = 0
  let setID = '0'
  let url = '/opponent?id=' + id
  while(timer<timeout) {
    timer++
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if(response.status===200) {
      // get response, handle
      let resp = await response.json() as {
        opponentID: string;
      }
      setID = resp.opponentID
      if(setID!=='0') {
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
  if(setID!=='0') {
    togglePopup(true, 'success', getString('good_game'))
    setTimeout(function(){ togglePopup(true, "success", getString('your_move')) }, 1000)
    handleMovesWS(id)
  }
  else
    togglePopup(true, 'warn', getString('one_minute_timeout'))
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
  let url = '/log'
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
