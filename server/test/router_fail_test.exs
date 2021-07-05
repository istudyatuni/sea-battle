defmodule SeaBattleServer.Routers.ApiFailTest do
  use ExUnit.Case, async: false
  use Plug.Test

  @options SeaBattleServer.Routers.Api.init([])

  test "ID on shot not exist" do
    conn =
      :get
      |> conn("/api/shot?id=3&x=0&y=0", %{})
      |> SeaBattleServer.Routers.Api.call(@options)

    assert conn.status == 202
  end

  test "Patch opponent ID" do
    conn =
      :patch
      |> conn("/api/opponent?id=3&opponentID=3", %{})
      |> SeaBattleServer.Routers.Api.call(@options)

    assert conn.status == 400
  end
end
