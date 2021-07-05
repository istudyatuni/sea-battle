import { SendShot } from 'api/BattleAPI'

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

export const delay = (ms: number) => {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

export const transformBack = (f: number[][]): number[][] => {
  let a = []
  let i: number
  let j: number
  for(i = 0; i < 10; i++) {
    let t = []
    for(j = 0; j < 10; j++) {
      if(f[i][j]!==0) {
        // why 3 - see components/values.md
        t.push(3)
      } else {
        t.push(0)
      }
    }
    a.push(t)
  }
  return a
}

type ship = {
  res: string,   // success, fail or no need (already find)
  type: string,  // row or col
  index: number, // row (col) index
  beg: number,   // begin ship index
  end: number,   // end index
  len: number    // ship length
}

export type AllShips = {
  result: string,
  field: number[][],
  total: number,
  len: object
}

export const validateAndTransform = (field: number[][]): AllShips => {
  let ships = [...field]
  let len:any = {}

  let result = {result: 'fail', field: ships, total: 0, len: {}}
  let counter = 1

  let i: number
  let j: number
  let tmp: ship
  for(i = 0; i < 10; i++) {
    for(j = 0; j < 10; j++) {

      if(field[i][j] === 1) {
        tmp = findShip(field, i, j)
        if(tmp.res === 'fail') {
          return result
        } else if(tmp.res === 'success') {
          ships = setShip(ships, tmp, counter)
          len[counter] = tmp.len
          counter++
        }
      }

    }
  }
  result.result = 'success'
  result.field = ships
  result.total = counter - 1
  result.len = len
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

  /**
   * проверка на наличие занятых клеток в "ореоле" корабля - вверх/вниз, вправо/влево от основной оси
   * @param param {"координата" по которой расположен корабль - i, j}
   * @param x {1 координата точки}
   * @param y {2 координата точки}
   * @param a {отклоняться (на сколько, но ставим 0 или 1) в текущей позиции в сторону или нет - для x}
   * @param b {аналогично - для y}
   */
  let check = (param: number, x: number, y: number, a: number, b: number): boolean => {
    // ship on side
    if(param === 0 && field[x + a][y + b] === 1) {
      return false
    }
    if(param === 9 && field[x - a][y - b] === 1) {
      return false
    }
    // ship not near side
    if((param > 0 && param < 9) &&
      (field[x - a][y - b] === 1 || field[x + a][y + b] === 1))
    {
      return false
    }
    return true
  }

  // vertical ship and len > 1
  if(i < 9 && field[i + 1][j] === 1) {
    while(end < 10) {
      /*
        checking smth like
        0000
        0110
        0010
        0000
       */
      if(check(j, end, j, 0, 1) === false) {
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
        if(end !== 9 && check(j, end + 1, j, 0, 1) === false) {
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
    while(end < 10) {
      if(check(i, i, end, 1, 0) === false) {
        result.res = 'fail'
        return result
      }
      // find zero or field side
      if(end === 9 || field[i][end + 1] === 0) {
        if(end !== 9 && check(i, i, end + 1, 1, 0) === false) {
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
    if(j < 9 && check(i, i, j + 1, 1, 0) === false) {
      result.res = 'fail'
      return result
    }
    // index == i because type == row
    result = {
      res: 'success',
      type: 'row',
      index: i,
      beg: j,
      end: j,
      len: 1
    }
    return result
  }
  return result
}

/**
 * 01100 -> 03300
 * change ship's '1' to '{num}'
 * for more details see doc/ships.json
 */
const setShip = (f: number[][], s: ship, num: number): number[][] => {
  let field = [...f]
  let i: number
  for(i = s.beg; i <= s.end; i++) {
    if(s.type === 'row') {
      field[s.index][i] = num
    } else if(s.type === 'col') {
      field[i][s.index] = num
    }
  }
  return field
}
