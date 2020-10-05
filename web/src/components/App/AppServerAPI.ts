import { togglePopup } from './AppFunctions'

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
      opponent: string;
    }
    setID(resp.id)
    togglePopup(false)
  } else {
    // server unavailable
    togglePopup(true, "Server unavailable")
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
    togglePopup(true, "Server unavailable")
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
    togglePopup(false)

    // hide button
    let getID = document.getElementById('getID')
    if(getID!==null && resp.opponentID !== "0")
      getID.style.display = 'none'
  } else {
    // server unavailable
    togglePopup(true, "Server unavailable")
  }
}
