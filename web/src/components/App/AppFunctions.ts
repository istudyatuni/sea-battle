import { SendShot } from './api/BattleAPI'
import { getString } from '../Translation/String'

export const togglePopup = (a: boolean, classColor: string = "", message: string = "") => {
  let popup = document.getElementById("popup")
  if(popup!==null) {
    popup.classList.remove("success", "error", "info", "warn")
    if(a===true) {
      popup.classList.add("show")
      popup.classList.add(classColor)
    } else {
      popup.classList.remove("show")
    }
    popup.innerHTML = message + '<span>×</span>'
  }
}

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
    return getString('enabled')
  else
    return getString('disabled')
}

export const HitOrMiss = async (id: string,
                                x: number,
                                y: number,
                                changeField: (arg0: number, arg1: number, arg2: number) => void) => {
  let type = "none"
  async function returnResponse(response: any) {
    type = response.type
  }
  await SendShot(id, x, y, returnResponse)

  if (type==='miss')
    changeField(x, y, 1)
  else if (type === 'hit')
    changeField(x, y, 2)
}

export const removeYID = (): void => {
  let yID = document.getElementById('yID')
  if(yID!==null) {
    yID.style.display = 'none'
  }
}

export const delay = (ms: number) => {
    return new Promise( resolve => setTimeout(resolve, ms) );
}
