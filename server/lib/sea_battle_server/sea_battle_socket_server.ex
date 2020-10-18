defmodule SeaBattleServer.SocketHandler do
  require Logger
  @behaviour :cowboy_websocket

  def init(request, _state) do
    state = %{registry_key: request.path}

    {:cowboy_websocket, request, state}
  end

  def websocket_init(state) do
    Registry.SeaBattleServer
    |> Registry.register(state.registry_key, {})

    {:ok, state}
  end

  def websocket_handle({:text, json}, state) do
    payload = Poison.decode!(json)
    Logger.debug("Get WebSocket message #{inspect(payload)}")
    id = payload["id"]

    id = SeaBattleServer.ShipHandler.getOpponentID(id)

    websocket_send_msg(id, state)
    message = Poison.encode!(%{"opponentID" => id})
    Logger.debug("Sending to client #{inspect(message)}")
    {:reply, {:text, message}, state}
  end

  def websocket_send_msg(message, state) do
    Registry.SeaBattleServer
    |> Registry.dispatch(state.registry_key, fn entries ->
      for {pid, _} <- entries do
        if pid != self() do
          Process.send(pid, message, [])
        end
      end
    end)
  end

  def websocket_info(_info, state) do
    {:reply, state}
  end

  def terminate(_reason, _req, _state) do
    :ok
  end
end
