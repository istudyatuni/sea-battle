defmodule SeaBattleServer.ShipHandler do
  @moduledoc """
    Handler with logic for work with ships
  """

  require Logger
  @all_ships :all_ships
  @can_move :can_move

  alias SeaBattleServer.EtsHandler, as: Ets
  alias SeaBattleServer.SocketHandler.PackBroadcast, as: Broadcast

  def insert_new_ships(body) do
    id = Ets.number?()
    id = id + 1

    :ets.insert(@all_ships, {"number", id})
    id = to_string(id)
    op_id = body["opponent"]

    el = %{
      opponent: op_id,
      field: body["field"],
      total: body["total"],
      # number of alive cells i-th ship
      alive: body["len"]
    }

    existance = :ets.insert_new(@all_ships, {id, el})

    :ets.insert(@can_move, {id, false})

    if op_id !== "0" do
      set_opponent(op_id, id)
      pid = Ets.wspid?(op_id)

      if pid != nil and Process.alive?(pid) do
        Process.send(pid, id, [])
      end
    end

    if existance == true do
      # created
      Logger.debug("inserting, id=#{id}")
      [%{"id" => id, "opponentID" => op_id}, 201]
    else
      # AHAHA INTERNAL SERVER ERROR and I don't know why
      Logger.error("server error, cannot insert_new in ETS")
      ["", 500]
    end
  end

  def set_opponent(id, op_id) do
    # 1st player can shoot the 2nd
    :ets.insert(@can_move, {op_id, true})

    check = Ets.number?()

    # for comparing
    {id, ""} = Integer.parse(id)
    {op_id, ""} = Integer.parse(op_id)

    if id <= check && op_id <= check && id > 0 && op_id > 0 do
      id = to_string(id)
      op_id = to_string(op_id)
      existance = Ets.update_op_id(id, op_id)

      if existance == true do
        Logger.debug("set opponent, id=#{id}, op_id=#{op_id}")
        [%{"id" => id, "opponentID" => op_id}, 201]
      else
        ["", 500]
      end
    else
      # if id or op_id is invalid
      Logger.warn("id is invalid, id=#{id}, op_id=#{op_id}, number of all_ships=#{check}")
      [%{"error" => "some IDs not exist", "maxID" => check}, 400]
    end
  end

  def can_move?(id) do
    check = Ets.number?()
    {id, ""} = Integer.parse(id)

    if id <= check do
      id = to_string(id)

      can =
        Ets.opponent_id?(id)
        |> Ets.move?()

      [%{"id" => id, "can" => can}, 200]
    else
      [%{}, 400]
    end
  end

  def get_opponent_id(id) do
    {id, ""} = Integer.parse(id)

    if id > 0 do
      id =
        to_string(id)
        |> Ets.opponent_id?()

      [%{"opponentID" => id}, 200]
    else
      [%{"error" => "ID is invalid"}, 400]
    end
  end

  defp shot_result(id, x, y) do
    {x, ""} = Integer.parse(x)
    {y, ""} = Integer.parse(y)

    # position
    value =
      Ets.field?(id)
      |> Enum.at(x)
      |> Enum.at(y)

    Logger.debug("player is shot, x=#{x}, y=#{y}, value=#{value}")

    if value != 0 do
      alive = Ets.decrease_alive(id, value)

      # total opponent's ships
      total = Ets.decrease_total(id, alive)

      Broadcast.hit(id, alive, total, x, y)

      ["type", "hit", 200]
    else
      Broadcast.miss(id, x, y)

      Ets.swap_can_move(id)

      ["type", "miss", 200]
    end
  end

  def hit_or_miss(id, x, y) do
    # if id == id which store in opponent
    if id == Ets.opponent_id?(Ets.opponent_id?(id)) do
      id = Ets.opponent_id?(id)

      # :true or :false
      can = Ets.move?(id)

      if can === true do
        shot_result(id, x, y)
      else
        ["error", "Please wait", 202]
      end
    else
      Logger.warn("ID #{id} not exist")
      ["error", "Not linked", 202]
    end
  end
end
