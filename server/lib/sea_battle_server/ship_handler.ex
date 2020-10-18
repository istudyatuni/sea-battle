defmodule SeaBattleServer.ShipHandler do
  require Logger
  @all_ships :all_ships

  def insert_new_ships(ships) do
    id = :ets.lookup(@all_ships, "number")
    id = Enum.at(id, 0) |> elem(1)
    id = id + 1

    :ets.insert(@all_ships, {"number", id})
    id = to_string(id)
    opID = ships["opponent"]

    existance = :ets.insert_new(@all_ships, {id, opID, ships["ships"]})

    if opID !== "0" do
      set_opponent(opID, id)
    end

    if existance == true do
      # created
      Logger.debug("inserting, id=#{id}")
      [_, _] = [%{"id" => id, "opponentID" => opID}, 201]
    else
      # AHAHA INTERNAL SERVER ERROR and I don't know why
      Logger.error("server error, cannot insert_new in ETS")
      [_, _] = ["", 500]
    end
  end

  def set_opponent(id, opID) do
    check = :ets.lookup(@all_ships, "number")
    check = Enum.at(check, 0) |> elem(1)

    # for comparing
    {id, ""} = Integer.parse(id)
    {opID, ""} = Integer.parse(opID)

    if id <= check && opID <= check && id > 0 && opID > 0 do
      id = to_string(id)
      opID = to_string(opID)

      # save ships
      ships = :ets.lookup(@all_ships, id)
      ships = Enum.at(ships, 0) |> elem(2)

      existance = :ets.insert(@all_ships, {id, opID, ships})

      if existance == true do
        Logger.debug("set opponent, id=#{id}, opID=#{opID}")
        [_, _] = [%{"id" => id, "opponent" => opID}, 201]
      else
        [_, _] = ["", 500]
      end
    else
      # if id or opID is invalid
      Logger.warn("id is invalid, id=#{id}, opID=#{opID}, number of all_ships=#{check}")
      [_, _] = [%{"error" => "some IDs not exist", "maxID" => check}, 400]
    end
  end

  def getOpponentID(id, count \\ 0) do
    opID = :ets.lookup(@all_ships, id)
    opID = Enum.at(opID, 0) |> elem(1)
    count = count + 1

    case opID do
      # one minute
      "0" when count < 600 ->
        :timer.sleep(100)
        getOpponentID(id, count)

      _ ->
        opID
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
    check = :ets.lookup(@all_ships, "number")
    check = Enum.at(check, 0) |> elem(1)

    {id, ""} = Integer.parse(id)

    if id <= check && id > 0 do
      id = to_string(id)
      # 1st elem from table's head (hd)
      ships = hd(:ets.lookup(@all_ships, id))
      ships = elem(ships, 2)

      {x, ""} = Integer.parse(x)
      {y, ""} = Integer.parse(y)

      value = Enum.at(ships, x)
      value = Enum.at(value, y)

      Logger.debug("player is shot, x=#{x}, y=#{y}, value=#{value}")

      if value == 1 do
        [_, _, _] = ["type", "hit", 200]
      else
        [_, _, _] = ["type", "miss", 200]
      end
    else
      [_, _, _] = ["error", "ID not exist", 404]
    end
  end
end
