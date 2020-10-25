defmodule SeaBattleServer.ShipHandler do
  require Logger
  @all_ships :all_ships
  @can_move :can_move

  def insert_new_ships(ships) do
    id =
      :ets.lookup(@all_ships, "number")
      |> Enum.at(0)
      |> elem(1)

    id = id + 1

    :ets.insert(@all_ships, {"number", id})
    id = to_string(id)
    opID = ships["opponent"]

    existance = :ets.insert_new(@all_ships, {id, opID, ships["ships"]})

    :ets.insert(@can_move, {id, false})

    if opID !== "0" do
      set_opponent(opID, id)
    end

    if existance == true do
      # created
      Logger.debug("inserting, id=#{id}")
      [%{"id" => id, "opponentID" => opID}, 201]
    else
      # AHAHA INTERNAL SERVER ERROR and I don't know why
      Logger.error("server error, cannot insert_new in ETS")
      ["", 500]
    end
  end

  def set_opponent(id, opID) do
    # 1st player can shoot the 2nd
    :ets.insert(@can_move, {opID, true})

    check =
      :ets.lookup(@all_ships, "number")
      |> Enum.at(0)
      |> elem(1)

    # for comparing
    {id, ""} = Integer.parse(id)
    {opID, ""} = Integer.parse(opID)

    if id <= check && opID <= check && id > 0 && opID > 0 do
      id = to_string(id)
      opID = to_string(opID)

      # save ships
      ships =
        :ets.lookup(@all_ships, id)
        |> Enum.at(0)
        |> elem(2)

      existance = :ets.insert(@all_ships, {id, opID, ships})

      if existance == true do
        Logger.debug("set opponent, id=#{id}, opID=#{opID}")
        [%{"id" => id, "opponent" => opID}, 201]
      else
        ["", 500]
      end
    else
      # if id or opID is invalid
      Logger.warn("id is invalid, id=#{id}, opID=#{opID}, number of all_ships=#{check}")
      [%{"error" => "some IDs not exist", "maxID" => check}, 400]
    end
  end

  def getOpponentID(id) do
    {id, ""} = Integer.parse(id)

    if id > 0 do
      id = to_string(id)

      id =
        :ets.lookup(@all_ships, id)
        |> Enum.at(0)
        |> elem(1)

      [%{"opponentID" => id}, 200]
    else
      [%{"error" => "ID is invalid"}, 400]
    end
  end

  # one minute
  @timeout 20 * 10

  def onChangeOpponentID(id, count \\ 0) do
    opID =
      :ets.lookup(@all_ships, id)
      |> Enum.at(0)
      |> elem(1)

    count = count + 1

    case opID do
      "0" when count < @timeout ->
        :timer.sleep(100)
        onChangeOpponentID(id, count)

      _ ->
        opID
    end
  end

  # wait when can_move: true -> false
  def onEnableMove(id, count \\ 0) do
    can =
      :ets.lookup(@can_move, id)
      |> Enum.at(0)
      |> elem(1)

    count = count + 1

    case can do
      true when count < @timeout ->
        # wait for opponent
        :timer.sleep(100)
        onEnableMove(id, count)
      true when count >= @timeout ->
        # opponent can't move by some reason (can't tap to cell maybe)
        "close"
      false ->
        # opponent made shot
        "move"
    end
  end

  defp swapCanMove(cant) do
    # opponent ID
    can =
      :ets.lookup(@all_ships, cant)
      |> Enum.at(0)
      |> elem(1)

    :ets.insert(@can_move, {can, true})
    :ets.insert(@can_move, {cant, false})
  end

  defp shotResult(id, x, y) do
    # 1st elem from table's head (hd)
    ships =
      hd(:ets.lookup(@all_ships, id))
      |> elem(2)

    {x, ""} = Integer.parse(x)
    {y, ""} = Integer.parse(y)

    value =
      Enum.at(ships, x)
      |> Enum.at(y)

    Logger.debug("player is shot, x=#{x}, y=#{y}, value=#{value}")

    if value == 1 do
      ["type", "hit", 200]
    else
      swapCanMove(id)
      ["type", "miss", 200]
    end
  end

  def hitOrMiss(id, x, y) do
    check =
      :ets.lookup(@all_ships, "number")
      |> Enum.at(0)
      |> elem(1)

    {id, ""} = Integer.parse(id)

    if id <= check && id > 0 do
      id = to_string(id)

      # :true or :false
      can =
        :ets.lookup(@can_move, id)
        |> Enum.at(0)
        |> elem(1)

      if can === true do
        shotResult(id, x, y)
      else
        ["error", "Please wait", 202]
      end
    else
      ["error", "ID not exist", 202]
    end
  end
end
