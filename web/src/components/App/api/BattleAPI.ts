import { delay, togglePopup } from '../AppFunctions'
import { getString } from '../../Translation/String'
import { sendLog } from './MainServerAPI'

export const SendShot = async (id: string, x: number, y: number, sendResp: (arg0: any)=>any) => {
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
  let ws = new WebSocket('ws://localhost:4000/ws/battle/' + id)
  ws.onopen = () => {
    ws.send(JSON.stringify({ "id": id }))
  }
  ws.onmessage = ({data}) => {
    let action = JSON.parse(data).action
    if(action==='move' || action==='opponent_hit' || action==='opponent_move' || action==='decrease_alive') {
      togglePopup(false)
      setTimeout(function(){
        togglePopup(true, 'success', getString(action))
      }, 50)
    }
  }
  ws.onerror = (e) => {
    sendLog('WebSocket error, id=' + id + ', downgrade to polling', e)
    console.error('WebSocket failed: ', e, 'downgrade to polling')
    handleMovesPoll(id)
  }
  ws.onclose = (e) => {
    togglePopup(true, 'warn', getString('move_timeout'))
  }
}

export const handleMovesPoll = async (id: string) => {
  let timeout = 10//60 * 3
  let timer = 0
  let url = '/move?id=' + id
  while(timer<timeout) {
    timer++
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    if(response.status===200) {
      // handle response
      let resp = await response.json() as {
        can: boolean
      }
      if(resp.can===true) {
        togglePopup(true, 'success', getString('move'))
        // again
        timer = 0
      }
      await delay(1000)
    }
  }
  if(timer>=timeout) {
    togglePopup(true, 'warn', getString('move_timeout'))
  }
}
