defmodule SeaBattleServer.ShipHandler do
  require Logger
  @all_ships :all_ships

  defmacro __using__(_opts) do
    quote do
      import SeaBattleServer.ShipHandler
    end
  end

  def hitOrMiss(id, x, y) do
    # 1st elem from table's head (hd)
    ships = elem(hd(:ets.lookup(@all_ships, id)), 1)
    value = Enum.at(ships, x)
    value = Enum.at(value, y)

    if value == 1 do
      _ = "hit"
    else
      _ = "miss"
    end
  end
end
