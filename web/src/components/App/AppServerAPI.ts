import { togglePopup, removeGetOp } from './AppFunctions'

export const SendShips = async (ships: number[][], setID: (arg0: string)=>void,
  opID: string) => {
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
    togglePopup(true, "success", "Good game!")
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
  } else {
    // server unavailable
    togglePopup(true, "error", "Server unavailable")
    console.error('Failed, response status: ', response.status)
  }
}

export const getOpponentID = async (id: string, setOpID: (arg0: string)=>void) => {
  let url = '/opponentID?id=' + id
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if(response.ok) {
    let resp = await response.json() as {
      opponentID: string;
    }
    setOpID(resp.opponentID)

    // hide button
    removeGetOp(resp.opponentID)
    if(resp.opponentID!=="0")
      togglePopup(true, "success", "Successfully get ID")
  } else {
    // server unavailable
    togglePopup(true, "error", "Server unavailable")
    console.error('Failed, response status: ', response.status)
  }
}
