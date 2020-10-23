defmodule SeaBattleServer.RouterSuccessTest do
  use ExUnit.Case, async: false
  use Plug.Test

  @options SeaBattleServer.Router.init([])

  test "Posting ships" do
    ships = [
      [1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0, 0]
    ]

    body = %{"opponent" => "0", "ships" => ships}
    body = Poison.encode!(body)

    conn = conn(:post, "/ships", body) |> SeaBattleServer.Router.call(@options)
    body = Poison.decode!(conn.resp_body)

    assert body == %{"id" => "2", "opponentID" => "0"}
    assert conn.status == 201
  end

  test "Making shots" do
    conn = :get |> conn("/shot?id=1&x=0&y=0", %{}) |> SeaBattleServer.Router.call(@options)
    body = Poison.decode!(conn.resp_body)

    assert body == %{"type" => "hit", "id" => "1"}
    assert conn.status == 200

    conn = :get |> conn("/shot?id=1&x=0&y=1", %{}) |> SeaBattleServer.Router.call(@options)
    body = Poison.decode!(conn.resp_body)

    assert body == %{"type" => "miss", "id" => "1"}
    assert conn.status == 200
  end

  test "Get opponent ID" do
    conn = :get |> conn("/opponent?id=1", %{}) |> SeaBattleServer.Router.call(@options)
    body = Poison.decode!(conn.resp_body)

    assert body == %{"opponentID" => "1"}
    assert conn.status == 200
  end

  test "Patch opponent ID" do
    conn =
      :patch |> conn("/opponent?id=1&opponentID=1", %{}) |> SeaBattleServer.Router.call(@options)

    body = Poison.decode!(conn.resp_body)

    assert body == %{"opponent" => "1", "id" => "1"}
    assert conn.status == 201
  end
end
