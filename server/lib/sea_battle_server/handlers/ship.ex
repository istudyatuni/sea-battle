defmodule SeaBattleServer.ShipHandler do
  require Logger
  @all_ships :all_ships
  @can_move :can_move

  alias SeaBattleServer.EtsHandler, as: Ets

  def insert_new_ships(body) do
    id = Ets.number?()
    id = id + 1

    :ets.insert(@all_ships, {"number", id})
    id = to_string(id)
    opID = body["opponent"]

    el = %{
      opponent: opID,
      field: body["field"],
      total: body["total"],
      # number of alive cells i-th ship
      alive: body["len"]
    }

    existance = :ets.insert_new(@all_ships, {id, el})

    :ets.insert(@can_move, {id, false})

    if opID !== "0" do
      set_opponent(opID, id)
      pid = Ets.wspid?(opID)

      if pid != nil and Process.alive?(pid) do
        Process.send(pid, id, [])
      end
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

    check = Ets.number?()

    # for comparing
    {id, ""} = Integer.parse(id)
    {opID, ""} = Integer.parse(opID)

    if id <= check && opID <= check && id > 0 && opID > 0 do
      id = to_string(id)
      opID = to_string(opID)
      existance = Ets.updateOpID(id, opID)

      if existance == true do
        Logger.debug("set opponent, id=#{id}, opID=#{opID}")
        [%{"id" => id, "opponentID" => opID}, 201]
      else
        ["", 500]
      end
    else
      # if id or opID is invalid
      Logger.warn("id is invalid, id=#{id}, opID=#{opID}, number of all_ships=#{check}")
      [%{"error" => "some IDs not exist", "maxID" => check}, 400]
    end
  end

  def can_move?(id) do
    check = Ets.number?()
    {id, ""} = Integer.parse(id)

    if id <= check do
      id = to_string(id)

      can =
        Ets.opponentID?(id)
        |> Ets.move?()

      [%{"id" => id, "can" => can}, 200]
    else
      [%{}, 400]
    end
  end

  def getOpponentID(id) do
    {id, ""} = Integer.parse(id)

    if id > 0 do
      id =
        to_string(id)
        |> Ets.opponentID?()

      [%{"opponentID" => id}, 200]
    else
      [%{"error" => "ID is invalid"}, 400]
    end
  end

  defp swapCanMove(cant) do
    can = Ets.opponentID?(cant)

    :ets.insert(@can_move, {can, true})
    :ets.insert(@can_move, {cant, false})
  end

  defp sendMove(pid) do
    Process.send(pid, "move", [])
  end

  defp sendOpMove(pid) do
    Process.send(pid, "opponent_move", [])
  end

  defp sendHit(pid) do
    Process.send(pid, "opponent_hit", [])
  end

  def sendDecreaseAliveShip(pid) do
    Process.send(pid, "decrease_alive", [])
  end

  defp shotResult(id, x, y) do
    {x, ""} = Integer.parse(x)
    {y, ""} = Integer.parse(y)

    # position
    value =
      Ets.field?(id)
      |> Enum.at(x)
      |> Enum.at(y)

    Logger.debug("player is shot, x=#{x}, y=#{y}, value=#{value}")

    if value != 0 do
      pid = Ets.wspid?(id)
      alive = Ets.decrease_alive(id, value)

      if alive == 0 do
        # send decrease ships to player
        if pid != nil and Process.alive?(pid) do
          Logger.debug("Sending decrease alive ships, id=#{Ets.opponentID?(id)}")
          sendDecreaseAliveShip(pid)
        end
      else
        # send hit to player
        if pid != nil and Process.alive?(pid) do
          Logger.debug("Sending info about hitting, id=#{id}")
          sendHit(pid)
        end
      end

      pid =
        Ets.opponentID?(id)
        |> Ets.wspid?()

      # send move to player
      if pid != nil and Process.alive?(pid) do
        Logger.debug("Sending move after hit, id=#{Ets.opponentID?(id)}")
        sendMove(pid)
      end

      ["type", "hit", 200]
    else
      # send move to opponent
      pid = Ets.wspid?(id)

      if pid != nil and Process.alive?(pid) do
        Logger.debug("Sending move after miss, id=#{id}")
        sendMove(pid)
      end

      # send opponent_move to player
      pid =
        Ets.opponentID?(id)
        |> Ets.wspid?()

      if pid != nil and Process.alive?(pid) do
        Logger.debug("Sending opponent_move, id=#{id}")
        sendOpMove(pid)
      end

      swapCanMove(id)
      ["type", "miss", 200]
    end
  end

  def hitOrMiss(id, x, y) do
    check = Ets.number?()

    {id, ""} = Integer.parse(id)

    if id <= check && id > 0 do
      id =
        to_string(id)
        |> Ets.opponentID?()

      # :true or :false
      can = Ets.move?(id)

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
