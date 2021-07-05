## Values of internal variables

**`gameMode`**:
- `0` - placing ships (before battle)
- `1` - battle
- `2` - view  player own field (on left)

**`isClear`**:
- `true` - if player can now clear ships
- `false` - if not

**`field`**: (individual elements)
1. When placing ships:
- `0` - empty cell
- `1` - cell with ships block
2. When battle:
- `0` - empty cell
- `1` - miss cell
- `2` - hit cell
3. Player field:
- `0` - empty field
- `1` - miss cell
- `2` - hit cell
- `3` - ship
