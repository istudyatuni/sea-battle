import { SendShot } from './AppServerAPI'

export const FieldInit = (): boolean[][] => {
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

export const HideOrNot = (a: number): any => {
  if(a===1) {
    return { display: 'none' }
  }
}

export const BoolToOnOff = (a: boolean): string => {
  if(a===true)
    return 'Enabled'
  else
    return 'Disabled'
}

export const HitOrMiss = async (id: string, x: number, y: number) => {
  let type = "none"
  async function returnResponse(response: any) {
    type = response.type
  }
  SendShot(id, x, y, returnResponse)
  console.log(type)
}
