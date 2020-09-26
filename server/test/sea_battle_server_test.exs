defmodule SeaBattleServerTest do
  use ExUnit.Case
  doctest SeaBattleServer

  test "greets the world" do
    assert SeaBattleServer.hello() == :world
  end
end
