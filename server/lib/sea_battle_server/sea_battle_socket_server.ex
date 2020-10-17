defmodule SeaBattleServer.SocketHandler do
  require Logger

  def start(port) do
    spawn(fn ->
      case :gen_tcp.listen(port, [:binary, active: false, reuseaddr: true]) do
        {:ok, socket} ->
          Logger.info("Connected.")
          # <--- We'll handle this next.
          accept_connection(socket)

        {:error, reason} ->
          Logger.error("Could not listen: #{reason}")
      end
    end)
  end
end
