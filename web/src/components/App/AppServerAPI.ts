import { togglePopup, removeYID } from './AppFunctions'
import { getString } from '../Translation/String'

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
      togglePopup(true, "success", getString('good_game'))
      setTimeout(function(){ removeYID() }, 30)
    } else {
      togglePopup(true, "info", getString('please_wait'))
      // getOpponentID(resp.id, setOpID, refresh)
    }
  } else {
    // server unavailable
    togglePopup(true, "error", getString('server_unavailable'))
    console.error('Failed, response status: ', response.status)
  }
}

export const SendShot = async (id: string,
                                x: number,
                                y: number,
                                sendResp: (arg0: any)=>any
                              ) => {
  let url = '/shot?id=' + id + '&x=' + x + '&y=' + y
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if(response.status===202) {
    // need wait for set opponent id by other player
    togglePopup(true, "info", getString('please_wait'))
    console.error('Failed, response status: ', response.status)
  } else if(response.ok) {
    // everything ok, handle response
    let resp = await response.json() as {
      id: string;
      type: string;
    }
    await sendResp(resp)
    togglePopup(false)
  } else {
    // server unavailable
    togglePopup(true, "error", getString('server_unavailable'))
    console.error('Failed, response status: ', response.status)
  }
}

export const getOpponentID = (id: string, setOpID: (arg0: string)=>void, refresh: (arg0: number)=>void) => {
  /*let ws = new WebSocket('ws://localhost:4000/ws/' + id)
  ws.onopen = () => {
    ws.send(JSON.stringify({ "id": id }))
  }
  ws.onmessage = ({data}) => {
    let json = JSON.parse(data)
    if(json.opponentID!=="0") {
      setOpID(json.opponentID)
      togglePopup(true, "success", getString('good_game'))
      removeYID()
    } else {
      // one minute server timeout
      togglePopup(true, "warn", getString('one_minute_timeout'))
      ws.close(1000, 'Timeout by server')
      setTimeout(function(){ refresh(0); togglePopup(false) }, 10 * 1000)
    }
  }
  ws.onerror = (e) => {
    togglePopup(true, "error", 'Error: ' + e)
    alert('WebSocket error: ' + e)
    console.error('Failed: ', e)
  }*/
}
