defmodule SeaBattleServer.TddTest do
  use ExUnit.Case

  def getElement(ships, x, y) do
    # IO.inspect(ships)
    element = ships["row"]
    element = element[x]

    if element != nil do
      IO.puts("ships[row][#{x}] != nil: #{inspect(element)}")
    else
      element = ships["col"]
      element = element[y]
      IO.puts("ships[col][#{y}]: #{inspect(element)}")
    end
  end

  test "Test new ships representation" do
    IO.puts("\n\n\n\n\n\n\n\n")

    # field for struct below
    # [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    # [1, 1, 1, 0, 0, 1, 1, 0, 0, 0],
    # [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    # [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    # [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    # [0, 1, 0, 0, 1, 0, 0, 0, 0, 0],
    # [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    # [0, 1, 0, 0, 0, 0, 1, 1, 0, 0],
    # [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    # [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]

    body = %{
      "col" => %{
        "1" => %{"5" => %{"end" => "7", "len" => "3"}},
        "4" => %{"3" => %{"end" => "5", "len" => "3"}}
      },
      "row" => %{
        "1" => %{
          "0" => %{"end" => "2", "len" => "3"},
          "5" => %{"end" => "6", "len" => "2"}
        },
        "7" => %{"6" => %{"end" => "7", "len" => "2"}}
      }
    }

    x = "2"
    y = "1"

    getElement(body, x, y)
  end
end
