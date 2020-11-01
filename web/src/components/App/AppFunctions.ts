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
  if(a===true) {
    return getString('enabled')
  } else {
    return getString('disabled')
  }
}

enum ShotResult {none, hit, miss}

export const HitOrMiss = async (id: string,
                                x: number,
                                y: number,
                                changeField: (arg0: number, arg1: number, arg2: number) => void) => {
  let type = 'none'
  async function returnResponse(response: any) {
    type = response.type
  }
  await SendShot(id, x, y, returnResponse)

  if (type===ShotResult[ShotResult.miss]) {
    changeField(x, y, 1)
  } else if (type === ShotResult[ShotResult.hit]) {
    changeField(x, y, 2)
  }
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

type ship = {
  res: string,
  type: string,
  index: number,
  beg: number,
  end: number,
  len: number
}
/*
  "res": success, fail or no need (already find)
  "type": row or col
  "index": row (col) index
  "beg": begin ship index
  "end": end index
  "len": ship length
*/

export const validateAndTransform = (field: number[][]): object => {
  let ships:ship[] = []
  let result = {result: 'fail', ships: ships}
  let tmp: ship

  let i: number
  let j: number
  for(i = 0; i < 10; i++) {
    for(j = 0; j < 10; j++) {

      if(field[i][j] === 1) {
        tmp = findShip(field, i, j)
        if(tmp.res === 'fail') {
          return result
        } else if(tmp.res === 'success') {
          ships.push(tmp)
        }
      }

    }
  }
  result.result = 'success'
  result.ships = ships
  return result
}

const findShip = (field: number[][], i: number, j: number): ship => {
  let result:ship = {res: 'none', type: 'none', index: -1, beg: -1, end: -1, len: -1}
  // not side and not begin ship
  if(i !== 0 && field[i - 1][j] === 1) {
    result.res = 'finded'
    return result
  }
  if(j !== 0 && field[i][j - 1] === 1) {
    result.res = 'finded'
    return result
  }

  let beg = i
  let end = i

  // vertical ship and len > 1
  if(i < 9 && field[i + 1][j] === 1) {
    let check = (x: number): boolean => {
      // ship on left side
      if(j === 0 && field[x][j + 1] === 1) {
        return false
      }
      // ship on right side
      if(j === 9 && field[x][j - 1] === 1) {
        return false
      }
      // ship not near side
      if((j > 0 && j < 9) && (field[x][j - 1] === 1 || field[x][j + 1] === 1)) {
        return false
      }
      return true
    }
    while(end < 10) {
      /*
        checking smth like
        0000
        0110
        0010
        0000
       */
      if(check(end) === false) {
        result.res = 'fail'
        return result
      }
      // SUCCESS
      // find zero or field side
      if(end === 9 || field[end + 1][j] === 0) {
        /*
          check smth like
          010
          010
          100
         */
        if(end !== 9 && check(end + 1) === false) {
          result.res = 'fail'
          return result
        }
        result = {
          res: 'success',
          type: 'col',
          index: j,
          beg: beg,
          end: end,
          len: end - beg + 1
        }
        return result
      }
      end++
    }
  }
  // horizontal ship and len > 1
  else if(j < 9 && field[i][j + 1] === 1) {
    beg = end = j
    let check = (y: number): boolean => {
      // ship on top
      if(i === 0 && field[i + 1][y] === 1) {
        return false
      }
      // ship on bottom
      if(i === 9 && field[i - 1][y] === 1) {
        return false
      }
      // ship not near side
      if((i > 0 && i < 9) && (field[i - 1][y] === 1 || field[i + 1][y] === 1)) {
        return false
      }
      return true
    }
    while(end < 10) {
      if(check(end) === false) {
        result.res = 'fail'
        return result
      }
      // SUCCESS
      // find zero or field side
      if(end === 9 || field[i][end + 1] === 0) {
        if(end !== 9 && check(end + 1) === false) {
          result.res = 'fail'
          return result
        }
        result = {
          res: 'success',
          type: 'row',
          index: i,
          beg: beg,
          end: end,
          len: end - beg + 1
        }
        return result
      }
      end++
    }
  }
  // len == 1
  else {
    // index == i because type == row
    result = {
      res: 'success',
      type: 'row',
      index: i,
      beg: beg,
      end: end,
      len: end - beg + 1
    }
    return result
  }
  return result
}
