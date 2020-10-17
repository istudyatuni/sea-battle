defmodule SeaBattleServer.SocketHandler do
  @behaviour :cowboy_websocket

  def init(req, state) do
    {@behaviour, req, state}
  end

  def websocket_init(state) do
    state = %{}
    {:ok, state}
  end

  def websocket_handle({:text, message}, state) do
    json = Poison.decode!(message)
    IO.inspect(json)
    # Poison.encode!(%{"key": "text"})
    {:reply, {:text, message}, state}
  end

  def websocket_info(info, state) do
    {:reply, state}
  end

  def terminate(_reason, _req, _state) do
    :ok
  end
end
