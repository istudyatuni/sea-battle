## POST `/ships`

Sending info about ships on battlefield as:
```json
{
  "ships": [
    [0,0,0,0,1,1,1,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0],
    [0,0,0,1,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,0,0,0,1,0,0],
    [0,0,0,0,1,0,0,1,0,0],
    [0,0,0,0,0,0,0,1,0,0]
  ]
}
```
Returned:
```json
{
  "id": "battle's id"
}
```

## PATCH `/opponent?id={id}&opponentID={opponentID}`

First you need send ships, and then - opponent's ID

Sending, who is opponent (his ID)
- `id` - player's id
- `opponentID` - his opponent's ID

Returned:
```json
{
  "id":       "player's id",
  "opponent": "opponent's ID"
}
```

## GET `/shot?id={id}&x={x}&y={y}`
Where player make shot

`x,y = [0..9]`, x - vertical (row), y - gorisantal (column): `[x][y]`

Returned:
```json
{
  "id": "id",
  "type": "value"
}
```
`value = ["hit","miss"]`
