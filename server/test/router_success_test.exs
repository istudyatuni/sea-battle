defmodule SeaBattleServer.RouterSuccessTest do
  use ExUnit.Case, async: false
  use Plug.Test

  @options SeaBattleServer.Router.init([])

  test "Posting ships" do
    ships = [
      [1, 0, 0, 0, 2, 2, 2, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 3, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 4, 4, 0, 0, 5, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 5, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 5, 0, 0],
      [0, 0, 0, 0, 6, 0, 0, 5, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 5, 0, 0]
    ]

    body = %{
      "opponent" => "0",
      "field" => ships,
      "total" => 6,
      "len" => %{
        "1" => 1,
        "2" => 3,
        "3" => 1,
        "4" => 2,
        "5" => 5,
        "6" => 1
      }
    }

    body = Poison.encode!(body)

    conn =
      :post
      |> conn("/ships", body)
      |> SeaBattleServer.Router.call(@options)

    body = Poison.decode!(conn.resp_body)

    assert body == %{"id" => "2", "opponentID" => "0"}
    assert conn.status == 201
  end

  test "Making shots" do
    conn =
      :get
      |> conn("/shot?id=1&x=0&y=0", %{})
      |> SeaBattleServer.Router.call(@options)

    body = Poison.decode!(conn.resp_body)

    assert body == %{"type" => "hit", "id" => "1"}
    assert conn.status == 200

    conn =
      :get
      |> conn("/shot?id=1&x=0&y=1", %{})
      |> SeaBattleServer.Router.call(@options)

    body = Poison.decode!(conn.resp_body)

    assert body == %{"type" => "miss", "id" => "1"}
    assert conn.status == 200
  end

  test "Get opponent ID" do
    conn =
      :get
      |> conn("/opponent?id=1", %{})
      |> SeaBattleServer.Router.call(@options)

    body = Poison.decode!(conn.resp_body)

    assert body == %{"opponentID" => "1"}
    assert conn.status == 200
  end

  test "Patch opponent ID" do
    conn =
      :patch
      |> conn("/opponent?id=1&opponentID=1", %{})
      |> SeaBattleServer.Router.call(@options)

    body = Poison.decode!(conn.resp_body)

    assert body == %{"opponentID" => "1", "id" => "1"}
    assert conn.status == 201
  end

  test "Send log" do
    body = Poison.encode!(%{"error" => "Test error"})

    conn =
      :post
      |> conn("/log", body)
      |> SeaBattleServer.Router.call(@options)

    assert conn.status == 204
  end

  test "Other routes" do
    conn =
      :get
      |> conn("/definitlynotworkingroute", %{})
      |> SeaBattleServer.Router.call(@options)

    assert conn.status == 404
  end
end
