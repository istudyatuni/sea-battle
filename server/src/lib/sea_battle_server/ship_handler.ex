defmodule SeaBattleServer.ShipHandler do
  require Logger
  @all_ships :all_ships
  @number_battles :number_battles

  defmacro __using__(_opts) do
    quote do
      import SeaBattleServer.ShipHandler
    end
  end

  def insert_new_ships(ships) do
    id = :ets.lookup(@number_battles, "number")
    id = Enum.at(id, 0) |> elem(1)
    id = id + 1

    :ets.insert(@number_battles, {"number", id})
    id = to_string(id)

    existance = :ets.insert_new(@all_ships, {id, ships["ships"]})

    if existance == false do
      # AHAHA INTERNAL SERVER ERROR and I don't know why
      [_, _] = ["", 500]
    else
      # created
      Logger.debug("inserting, id=#{id}")
      [_, _] = [%{"id" => id, "ships" => ships["ships"]}, 201]
    end
  end

  def show_ships(id) do
    IO.puts("show ships, id=#{id}")
    # if table not exist
    case :ets.whereis(@all_ships) do
      :undefined -> Logger.warn("ships is undefined")
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
