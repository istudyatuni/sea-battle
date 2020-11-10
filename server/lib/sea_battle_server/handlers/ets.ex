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
    el =
      :ets.lookup(@all_ships, id)
      |> Enum.at(0)

    if el != nil do
      elem(el, 1)
    else
      nil
    end
  end

  def opponentID?(id) do
    el = ship_element?(id)

    if el != nil do
      el.opponent
    else
      nil
    end
  end

  def updateOpID(id, opID) do
    el = ship_element?(id)
    el = %{el | opponent: opID}
    :ets.insert(@all_ships, {id, el})
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

  def swapCanMove(cant) do
    can = opponentID?(cant)

    :ets.insert(@can_move, {can, true})
    :ets.insert(@can_move, {cant, false})
  end

  def number_alive?(id, index) do
    el = ship_element?(id)
    el.alive[to_string(index)]
  end

  def total?(id) do
    el = ship_element?(id)
    el.total
  end

  defp updateShip(id, el) do
    :ets.insert(@all_ships, {id, el})
  end

  def decrease_alive(id, index) do
    num = number_alive?(id, index)

    if num > 0 do
      index = to_string(index)

      el = ship_element?(id)
      alive = el.alive

      el = %{
        el
        | alive: %{
            alive
            | index => num - 1
          }
      }

      updateShip(id, el)
    end

    num - 1
  end

  def decrease_total(id, alive) do
    total = total?(id)
    if alive == 0 do
      total = total - 1

      el = ship_element?(id)
      el = %{el | total: total}
      updateShip(id, el)

      total
    else
      total
    end
  end
end
