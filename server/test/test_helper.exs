# need some ships in ets for correct testing
ships = [
  [1, 0, 0, 0, 2, 2, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 4, 4, 0, 0, 5, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 5, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 5, 0, 0],
  [0, 0, 0, 0, 6, 0, 0, 5, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 5, 0, 0]
]

len = %{
  "1" => 1,
  "2" => 3,
  "3" => 1,
  "4" => 2,
  "5" => 5,
  "6" => 1
}

body = %{"opponent" => "1", "field" => ships, "len" => len, "total" => 6}
SeaBattleServer.ShipHandler.insert_new_ships(body)

ExUnit.start()
