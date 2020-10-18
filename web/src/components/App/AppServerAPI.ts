import { togglePopup, removeGetOp } from './AppFunctions'

export const SendShips = async (ships: number[][], setID: (arg0: string)=>void,
  opID: string, setOpID: (arg0: string)=>void) => {
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
    if(resp.opponentID!=="0")
      togglePopup(true, "success", "Good game!")
    else
      await getOpponentID(resp.id, setOpID)
  } else {
    // server unavailable
    togglePopup(true, "error", "Server unavailable")
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

  if(response.ok) {
    let resp = await response.json() as {
      id: string;
      type: string;
    }
    await sendResp(resp)
    togglePopup(false)
  } else if(response.status===404) {
    togglePopup(true, "info", "Please wait")
    console.error('Failed, response status: ', response.status)
  } else {
    // server unavailable
    togglePopup(true, "error", "Server unavailable")
    console.error('Failed, response status: ', response.status)
  }
}

export const getOpponentID = async (id: string, setOpID: (arg0: string)=>void) => {
  let ws = new WebSocket('ws://localhost:4000/ws/' + id)
  ws.onopen = () => {
    ws.send(JSON.stringify({ "id": id }))
  }
  ws.onmessage = ({data}) => {
    let json = JSON.parse(data)
    togglePopup(true, "info", 'WebSocket says: opponentID=' + json.opponentID)
    if(json.opponentID!=="0")
      togglePopup(true, "success", "Good game!")
    setOpID(json.opponentID)
  }
  ws.onerror = (e) => {
    togglePopup(true, "error", 'Error: ' + e)
    console.error('Failed: ', e)
  }
}
