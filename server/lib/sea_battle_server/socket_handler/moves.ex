defmodule SeaBattleServer.SocketHandler.Moves do
  require Logger
  @behaviour :cowboy_websocket

  def init(request, _state) do
    state = %{registry_key: request.path}
    Logger.debug("Init WebSocket connection, state: #{inspect(state)}")

    {:cowboy_websocket, request, state}
  end

  def websocket_init(state) do
    Registry.SeaBattleServer
    |> Registry.register(state.registry_key, {})

    Logger.debug("Subscrube to WebSocket \"moves\"")

    {:ok, state}
  end

  def websocket_handle({:text, json}, state) do
    json = Poison.decode!(json)
    Logger.debug("Get WebSocket message #{inspect(json)}")

    # TODO add logic

    Logger.debug("Sending to client #{inspect("message")}")
    {:reply, {:text, "message"}, state}
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

  def terminate(reason, request, _state) do
    Logger.debug(
      "Close socket connection, reason: #{inspect(reason)}, request: #{inspect(request)}"
    )

    :ok
  end
end
