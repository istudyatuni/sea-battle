## POST /ships

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

## GET /shot
Where player make shot
```json
{
  "id": "id",
  "x": 5,
  "y": 4
}
```
`x,y = [0..9]`
x - vertical, y - gorisantal: `[x][y]`

Returned:
```json
{
  "id": "id",
  "type": "value"
}
```
`value = ["hit","miss"]`
