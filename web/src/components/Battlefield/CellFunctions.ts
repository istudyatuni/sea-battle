export const settingShips = (first: boolean, clear: boolean): string => {
  let path
  if(first===false) {
    if(clear===false) {
      path = "Ship"
    } else {
      path = "Empty"
    }
  } else {
    path = "Empty"
  }
  return path
}

export const battle = (state: number): string => {
  let path
  if(state===1) {
    path = "Miss"
  } else if(state===2){
    path = "Hit"
  } else {
    path = "Empty"
  }
  return path
}

export const getCursor = (mode: number): any => {
  if(mode===1)
    return {cursor: "url('assets/aim50.png') 25 25, auto"}
}
