defmodule SeaBattleServer.ShipHandler do
  require Logger
  @all_ships :all_ships

  defmacro __using__(_opts) do
    quote do
      import SeaBattleServer.ShipHandler
    end
  end

  def insert_new_ships(ships) do
    existance = :ets.insert_new(@all_ships, {ships["id"], ships["ships"]})

    if existance == false do
      Logger.debug("ships table already exist, id=#{ships["id"]}")
      # not modified
      _ = 304
    else
      Logger.debug("inserting . .")
      # created
      _ = 201
    end
  end

  def show_ships(id) do
    IO.puts("show..")
    # if table not exist
    case :ets.whereis(@all_ships) do
      :undefined -> Logger.debug("ships is undefined")
      _ -> IO.inspect(:ets.lookup(@all_ships, id))
    end
  end

  def hitOrMiss(id, x, y) do
    # 1st elem from table's head (hd)
    ships = hd(:ets.lookup(@all_ships, id))
    ships = elem(ships, 1)

    value = Enum.at(ships, x)
    value = Enum.at(value, y)

    Logger.debug("player is shot, x=#{x}, y=#{y}, value=#{value}")
    if value == 1 do
      _ = "hit"
    else
      _ = "miss"
    end
  end
end
