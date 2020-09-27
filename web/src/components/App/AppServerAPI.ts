const NO_RESPONSE_CODE = 0

export const SendShips = async (ships: number[][], setID: (arg0: string)=>void) => {
  const response = await fetch('/ships', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ships: ships }),
  });

  if (response.status === NO_RESPONSE_CODE) {
    // server unavailable
    setID('Server unavailable')
  } else if(response.ok) {
    let resp = await response.json() as {
      id: string;
    }
    setID(resp.id)
  }
}


export const SendShot = async (id: string,
                                x: number,
                                y: number,
                                sendResp: (arg0: any)=>any
                              ) => {
  let url = '/shot/' + id + '?x=' + x + '&y=' + y
  console.log('url: ', url)
  const response = await fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if(response.ok) {
    let resp = await response.json() as {
      id: string;
      type: string;
    }
    sendResp(resp)
  } else if (response.status === NO_RESPONSE_CODE) {
    // server unavailable
  }
}
