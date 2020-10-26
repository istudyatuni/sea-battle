defmodule SeaBattleServer.SocketHandler.Opponent do
  require Logger
  @behaviour :cowboy_websocket

  def init(request, _state) do
    id =
      request.path_info
      |> Enum.at(0)

    state = %{registry_key: request.path, id: id}

    {:cowboy_websocket, request, state}
  end

  def websocket_init(state) do
    Registry.SeaBattleServer
    |> Registry.register(state.registry_key, {})

    :ets.insert_new(:ws, {state.id, self()})

    {:ok, state}
  end

  def websocket_handle({:text, msg}, state) do
    Logger.debug("Get WebSocket message #{msg}")
    {:reply, {:text, msg}, state}
  end

  def websocket_info(message, state) when is_bitstring(message) do
    message = Poison.encode!(%{"opponentID" => message})
    IO.inspect(message)
    {:reply, {:text, message}, state}
  end

  def terminate(reason, request, _state) do
    Logger.debug(
      "Close socket connection, reason: #{inspect(reason)}, request: #{inspect(request)}"
    )

    :ok
  end
end
