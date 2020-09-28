import { SendShot } from './AppServerAPI'

export const FieldInit = (): number[][] => {
  // return array filled with false value
  let ships = []
  for(let i=0; i<10; i++) {
    let ship = []
    for(let j=0; j<10; j++) {
      ship.push(0)
    }
    ships.push(ship)
  }
  return ships
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

export const HitOrMiss = async (id: string,
                                 x: number,
                                 y: number,
                                 changeField: (arg0: number,
                                               arg1: number,
                                               arg2: number
                                               ) => void
                                 ) => {
  let type = "none"
  async function returnResponse(response: any) {
    type = response.type
  }
  await SendShot(id, x, y, returnResponse)
  let value
  if (type==='miss')
    value = 1
  else // if type === 'hit'
    value = 2
  changeField(x, y, value)
}
