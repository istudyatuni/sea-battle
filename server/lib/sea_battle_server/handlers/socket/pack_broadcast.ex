defmodule SeaBattleServer.SocketHandler.PackBroadcast do
  require Logger
  alias SeaBattleServer.EtsHandler, as: Ets

  defp sendMove(pid) do
    Process.send(pid, "move", [])
  end

  defp sendCoord(pid, type, x, y) do
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

  defp sendOpMove(pid) do
    Process.send(pid, "opponent_move", [])
  end

  defp sendHit(pid) do
    Process.send(pid, "opponent_hit", [])
  end

  def sendDecreaseAliveShip(pid) do
    Process.send(pid, "decrease_alive", [])
  end

  defp sendHitMoves(id, alive, x, y) do
    pid = Ets.wspid?(id)

    if alive == 0 do
      # send decrease ships to opponent
      if pid != nil and Process.alive?(pid) do
        Logger.debug("Sending decrease alive ships, id=#{Ets.opponentID?(id)}")
        sendDecreaseAliveShip(pid)
      end
    else
      # send hit to opponent
      if pid != nil and Process.alive?(pid) do
        Logger.debug("Sending info about hitting, id=#{id}")
        sendHit(pid)
      end
    end

    # send coordinates to opponent
    if pid != nil and Process.alive?(pid) do
      Logger.debug("Sending coordinates, id=#{id}")
      sendCoord(pid, "hit", x, y)
    end

    pid =
      Ets.opponentID?(id)
      |> Ets.wspid?()

    # send move to player
    if pid != nil and Process.alive?(pid) do
      Logger.debug("Sending move after hit, id=#{Ets.opponentID?(id)}")
      sendMove(pid)
    end
  end

  defp sendEndGame(id) do
    Logger.debug("Sending endgame, id=#{id}, opID=#{Ets.opponentID?(id)}")

    pid = Ets.wspid?(id)

    if pid != nil and Process.alive?(pid) do
      Process.send(pid, "endgame", [])
    end

    pid =
      Ets.opponentID?(id)
      |> Ets.wspid?()

    if pid != nil and Process.alive?(pid) do
      Process.send(pid, "endgame", [])
    end
  end

  def hit(id, alive, total, x, y) do
    sendHitMoves(id, alive, x, y)

    if total == 0 do
      sendEndGame(id)
    end

    :ok
  end

  def miss(id, x, y) do
    pid = Ets.wspid?(id)

    # send move to opponent
    if pid != nil and Process.alive?(pid) do
      Logger.debug("Sending move after miss, id=#{id}")
      sendMove(pid)
    end

    # send coordinates to opponent
    if pid != nil and Process.alive?(pid) do
      Logger.debug("Sending coordinates, id=#{id}")
      sendCoord(pid, "miss", x, y)
    end

    pid =
      Ets.opponentID?(id)
      |> Ets.wspid?()

    # send opponent_move to player
    if pid != nil and Process.alive?(pid) do
      Logger.debug("Sending opponent_move, id=#{id}")
      sendOpMove(pid)
    end

    :ok
  end
end
