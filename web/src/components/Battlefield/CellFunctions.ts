export const battle = (state: number): string => {
  if(state===1) {
    return 'Miss'
  } else if(state===2) {
    return 'Hit'
  } else {
    return 'Empty'
  }
}

export const view = (state: number): string => {
  if(state===0) {
    return 'Empty'
  } else if(state===1) {
    return 'Miss'
  } else if(state===2) {
    return 'Hit'
  } else if(state===3) {
    return 'Ship'
  }
  return ''
}

export const getCursor = (mode: number): any => {
  if(mode===1) {
    return {cursor: "url('assets/aim50.png') 25 25, auto"}
  }
}
