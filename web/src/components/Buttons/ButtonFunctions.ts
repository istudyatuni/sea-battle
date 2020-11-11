export const newGame = () => {
  let n = document.getElementById('new_game')
  if(n!==null) {
    n.classList.remove('hide')
    n.classList.add('show')
  }
}
