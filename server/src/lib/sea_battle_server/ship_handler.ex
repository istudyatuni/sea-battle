defmodule SeaBattleServer.ShipHandler do
  require Logger

  defmacro __using__(_opts) do
    quote do
      import SeaBattleServer.ShipHandler
    end
  end
end
