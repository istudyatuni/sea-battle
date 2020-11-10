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

  def hit(id, value, x, y) do
    pid = Ets.wspid?(id)
    alive = Ets.decrease_alive(id, value)

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

    Ets.swapCanMove(id)

    :ok
  end
end
