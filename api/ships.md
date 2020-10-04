## POST `/ships`

Sending info about ships on battlefield as:
```json
{
  "opponent": "opponent's id (or 0)",
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
  "id": "battle's id",
  "opponentID": "opponent's ID (or 0)"
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
You need send as id - opponent's ID

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
