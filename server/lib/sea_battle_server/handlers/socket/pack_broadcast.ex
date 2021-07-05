defmodule SeaBattleServer.SocketHandler.PackBroadcast do
  @moduledoc """
    Helper for sending multi-message via WebSocket
  """

  require Logger
  alias SeaBattleServer.EtsHandler, as: Ets

  defp send_move(pid) do
    Process.send(pid, "move", [])
  end

  defp send_coord(pid, type, x, y) do
    Process.send(
      pid,
      %{
        "action" => "set_coordinate",
        "type" => type,
        "x" => x,
        "y" => y
      },
      []
    )
  end

  defp send_op_move(pid) do
    Process.send(pid, "opponent_move", [])
  end

  defp send_hit(pid) do
    Process.send(pid, "opponent_hit", [])
  end

  def send_decrease_alive_ship(pid) do
    Process.send(pid, "decrease_alive", [])
  end

  defp send_hit_moves(id, alive, x, y) do
    pid = Ets.wspid?(id)

    if alive == 0 do
      # send decrease ships to opponent
      if pid != nil and Process.alive?(pid) do
        Logger.debug("Sending decrease alive ships, id=#{Ets.opponent_id?(id)}")
        send_decrease_alive_ship(pid)
      end
    else
      # send hit to opponent
      if pid != nil and Process.alive?(pid) do
        Logger.debug("Sending info about hitting, id=#{id}")
        send_hit(pid)
      end
    end

    # send coordinates to opponent
    if pid != nil and Process.alive?(pid) do
      Logger.debug("Sending coordinates, id=#{id}")
      send_coord(pid, "hit", x, y)
    end

    pid =
      Ets.opponent_id?(id)
      |> Ets.wspid?()

    # send move to player
    if pid != nil and Process.alive?(pid) do
      Logger.debug("Sending move after hit, id=#{Ets.opponent_id?(id)}")
      send_move(pid)
    end
  end

  defp send_end_game(id) do
    Logger.debug("Sending endgame, id=#{id}, opID=#{Ets.opponent_id?(id)}")

    pid = Ets.wspid?(id)

    if pid != nil and Process.alive?(pid) do
      Process.send(pid, %{"action" => "endgame", "type" => "lose"}, [])
    end

    pid =
      Ets.opponent_id?(id)
      |> Ets.wspid?()

    if pid != nil and Process.alive?(pid) do
      Process.send(pid, %{"action" => "endgame", "type" => "win"}, [])
    end
  end

  def hit(id, alive, total, x, y) do
    send_hit_moves(id, alive, x, y)

    if total == 0 do
      send_end_game(id)
    end

    :ok
  end

  def miss(id, x, y) do
    pid = Ets.wspid?(id)

    # send move to opponent
    if pid != nil and Process.alive?(pid) do
      Logger.debug("Sending move after miss, id=#{id}")
      send_move(pid)
    end

    # send coordinates to opponent
    if pid != nil and Process.alive?(pid) do
      Logger.debug("Sending coordinates, id=#{id}")
      send_coord(pid, "miss", x, y)
    end

    pid =
      Ets.opponent_id?(id)
      |> Ets.wspid?()

    # send opponent_move to player
    if pid != nil and Process.alive?(pid) do
      Logger.debug("Sending opponent_move, id=#{id}")
      send_op_move(pid)
    end

    :ok
  end
end
