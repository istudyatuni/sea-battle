defmodule SeaBattleServer.ShipHelper do
  def find_ships(ships) do
    IO.inspect(Enum.at(ships, 0))
    row =
      Enum.at(ships, 0)
      |> Enum.reverse()

    i = []
    list = Enum.scan(row, &(if &1 == 1 and &2 == 0 do
      2
    end))
    IO.puts("reverse row: #{inspect(row)}, list: #{inspect(list)}, i: #{inspect(i)}")
  end
end
