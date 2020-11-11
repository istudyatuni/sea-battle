import { delay, togglePopup } from '../AppFunctions'
import { getString } from '../../Translation/String'
import { sendLog } from './MainServerAPI'
import { newGame } from '../../Buttons/ButtonFunctions'


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

export const handleMovesWS = async (id: string, setField: (arg0: number, arg1: number, arg2: number)=>void) => {
  let ws = new WebSocket('ws://localhost:4000/ws/battle/' + id)
  let disconnect = false
  ws.onopen = () => {
    ws.send(JSON.stringify({ "id": id }))
  }
  ws.onmessage = ({data}) => {
    data = JSON.parse(data)
    let action = data.action
    if(action==='move' || action==='opponent_hit' || action==='opponent_move' || action==='decrease_alive') {
      togglePopup(false)
      setTimeout(function(){
        togglePopup(true, 'success', getString(action))
      }, 50)
    } else if(action==='set_coordinate') {
      let type = data.type
      if(type==='miss') {
        setField(data.x, data.y, 1)
      } else if(type==='hit') {
        setField(data.x, data.y, 2)
      }
    } else if(action==='endgame') {
      newGame()
      togglePopup(false)

      let color = (t: string) => {
        if(t==='lose') {
          return 'warn'
        } else {
          return 'success'
        }
      }

      setTimeout(function(){
        togglePopup(true, color(data.type), getString(action + '_' + data.type))
      }, 50)

      ws.close(1000, 'endgame')
    } else if(action==='close') {
      newGame()
      ws.close(1000, 'Opponent disconnect')
      disconnect = true
    }
  }
  ws.onerror = (e) => {
    sendLog('WebSocket error, id=' + id + ', downgrade to polling', e)
    console.error('WebSocket failed: ', e, 'downgrade to polling')
    handleMovesPoll(id)
  }
  ws.onclose = (e) => {
    if(disconnect===true) {
      togglePopup(true, 'warn', getString('opponent_disconnected'))
    } else {
      togglePopup(true, 'warn', getString('move_timeout'))
    }
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
