export const ShipsInit = (): boolean[][] => {
  // return array filled with false value
  let ships = []
  for(let i=0; i<10; i++) {
    let ship = []
    for(let j=0; j<10; j++) {
      ship.push(false)
    }
    ships.push(ship)
  }
  return ships
}

export const BoolArrayToInt = (a: boolean[][]): number[][] => {
  let num = []
  for(let i=0; i<10; i++) {
    let tmp = []
    for(let j=0; j<10; j++) {
      if(a[i][j]===true){
        tmp.push(1)
      } else {
        tmp.push(0)
      }
    }
    num.push(tmp)
  }
  return num
}

export const hideOrNot = (a: number): any => {
  if(a===1) {
    return { display: 'none' }
  }
}
