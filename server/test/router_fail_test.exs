defmodule SeaBattleServer.RouterFailTest do
  use ExUnit.Case, async: false
  use Plug.Test

  @options SeaBattleServer.Router.init([])

  test "ID on shot not exist" do
    conn = :get |> conn("/shot?id=3&x=0&y=0", %{}) |> SeaBattleServer.Router.call(@options)
    assert conn.status == 404
  end

  test "Patch opponent ID" do
    conn =
      :patch |> conn("/opponent?id=3&opponentID=3", %{}) |> SeaBattleServer.Router.call(@options)
    assert conn.status == 400
  end

  test "Get opponent ID" do
    conn = :get |> conn("/opponentID?id=3", %{}) |> SeaBattleServer.Router.call(@options)
    assert conn.status == 400
  end
end
