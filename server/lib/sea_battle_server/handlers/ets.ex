defmodule SeaBattleServer.EtsHandler do
  @all_ships :all_ships
  @can_move :can_move

  def number? do
    :ets.lookup(@all_ships, "number")
    |> Enum.at(0)
    |> elem(1)
  end

  def wspid?(id) do
    pid =
      :ets.lookup(:ws, id)
      |> Enum.at(0)

    if pid != nil do
      elem(pid, 1)
    else
      nil
    end
  end

  defp ship_element?(id) do
    :ets.lookup(@all_ships, id)
    |> Enum.at(0)
    |> elem(1)
  end

  def opponentID?(id) do
    el = ship_element?(id)
    el.opponent
  end

  def field?(id) do
    el = ship_element?(id)
    el.field
  end

  def move?(id) do
    :ets.lookup(@can_move, id)
    |> Enum.at(0)
    |> elem(1)
  end
end
