import { togglePopup } from '../AppFunctions'
import { getString } from '../../Translation/String'
import { sendLog } from './MainServerAPI'

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
    console.info('Failed, response status: ', response.status)
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

export const handleMovesWS = async (id: string) => {
  let ws = new WebSocket('ws://localhost:4000/ws/moves/' + id)
  let message = JSON.stringify({ "id": id })
  ws.onopen = () => {
    ws.send(message)
  }
  ws.onmessage = ({data}) => {
    let json = JSON.parse(data)
    if(json.action==='move') {
      togglePopup(true, 'success', getString('your_move'))
    }
  }
  ws.onerror = (e) => {
    // here polling
    sendLog('WebSocket error, id=' + id, e)
    console.error('WebSocket error', e)
  }
  ws.onclose = (e) => {
    togglePopup(true, 'warn', getString('move_timeout'))
  }
}
