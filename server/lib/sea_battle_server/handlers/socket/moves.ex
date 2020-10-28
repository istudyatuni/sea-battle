defmodule SeaBattleServer.SocketHandler.Moves do
  require Logger
  @behaviour :cowboy_websocket

  def init(request, _state) do
    id =
      request.path_info
      |> Enum.at(0)

    state = %{registry_key: request.path, id: id}
    Logger.debug("Init WebSocket connection, state: #{inspect(state)}")

    # 3 minutes
    opts = %{:idle_timeout => 3 * 60 * 1000}
    {:cowboy_websocket, request, state, opts}
  end

  def websocket_init(state) do
    Registry.SeaBattleServer
    |> Registry.register(state.registry_key, {})

    :ets.insert(:ws, {state.id, self()})

    Logger.debug("Subscrube to WebSocket \"moves\"")

    {:ok, state}
  end

  def websocket_handle({:text, json}, state) do
    Logger.debug("Get WebSocket message #{json}")

    message = Poison.encode!(%{"action" => "wait"})
    Logger.debug("Sending to client #{message}")
    {:reply, {:text, message}, state}
  end

  def websocket_info(message, state) when is_bitstring(message) do
    message = Poison.encode!(%{"action" => message})
    {:reply, {:text, message}, state}
  end

  def terminate(reason, request, _state) do
    Logger.debug(
      "Close socket connection, reason: #{inspect(reason)}, request: #{inspect(request)}"
    )

    :ok
  end
end
