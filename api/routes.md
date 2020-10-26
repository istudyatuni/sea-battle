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
Returned if success:
```json
{
  "id": "battle's id",
  "opponentID": "opponent's ID (or 0)"
}
```
Code `201`

## PATCH `/opponent?id={id}&opponentID={opponentID}`

First you need send ships, and then - opponent's ID

Sending, who is opponent (his ID)
- `id` - player's id
- `opponentID` - his opponent's ID

Returned if success:
```json
{
  "id":       "player's id",
  "opponentID": "opponent's ID"
}
```
Code `201`

## GET `/shot?id={id}&x={x}&y={y}`
You need send as id - opponent's ID

Where player make shot

`x,y = [0..9]`, x - vertical (row), y - gorisantal (column): `[x][y]`

+ Returned if success:
```json
{
  "id": "id",
  "type": "value"
}
```
`value = ["hit","miss"]`

Code `200`

+ If player can't shoot:
```json
{
  "id": "id",
  "error": "Please wait"
}
```
Code `202`

## GET `/opponent?id={id}`

Returned if success:
```json
{
  "id": "id",
  "opponentID": "opponent's ID"
}
```
Code `200`

If ID is invalid, code `400`


## GET `/move?id={id}`

Returned if ID isn't invalid:
```json
{
  "id": "id",
  "can": true
}
```
`can == [true, false]`

Code `200`

If ID is invalid code `400`
