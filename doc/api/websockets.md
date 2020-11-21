## Opponent `/ws/opponent/{id}`
Timeout - 1 minute

**On message** reply message back

**When opponent ID has changed**, sending:
```json
{
  "opponentID": "opponent's ID"
}
```
Need closing chanel manually after getting correct ID

## Battle `/ws/battle/{id}`

Moves, number killed ships

Timeout - 3 minutes

**On message** sending:
```json
{
  "action": "wait"
}
```

**When time for player's move**, sending
+ To player:
```json
{
  "action": "move"
}
```

+ To opponent:
```json
{
  "action": "opponent_move"
}
```

**When opponent hitting** the cell of player's ships, sending:
```json
{
  "action": "opponent_hit"
}
```

**When opponent kill ship**

To player:
```json
{
  "action": "decrease_alive"
}
```

**On any change field** send to opponent:
```json
{
  "action": "set_coordinate",
  "type": "type",
  "x": 5,
  "y": 3
}
```
`"type": ["hit", "miss"]`
