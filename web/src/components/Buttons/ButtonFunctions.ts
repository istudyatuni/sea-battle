import { getString } from '../Translation/String'

export const newGame = () => {
  let n = document.getElementById('new_game')
  if(n!==null) {
    n.classList.remove('hide')
    n.classList.add('show')
  }
}

export const removeYID = (): void => {
  let yID = document.getElementById('yID')
  if(yID!==null) {
    yID.style.display = 'none'
  }
}

export const BoolToOnOff = (a: boolean): string => {
  if(a===true) {
    return getString('enabled')
  } else {
    return getString('disabled')
  }
}
