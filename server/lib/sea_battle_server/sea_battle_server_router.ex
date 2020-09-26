defmodule SeaBattleServer.Router do
  use Plug.Router
  use Plug.Debugger

  use SeaBattleServer.ShipHandler
  alias SeaBattleServer.ShipHandler

  require Logger
  plug(Plug.Logger, log: :debug)

  plug(:match)
  plug(:dispatch)

  get "/shot" do
    {:ok, body, conn} = read_body(conn)
    body = Poison.decode!(body)

    ans = ShipHandler.hitOrMiss(body["id"], body["x"], body["y"])
    ans = %{"id" => body["id"], "type" => ans}

    response = Poison.encode!(ans, [])
    send_resp(conn, 200, response)
  end

  post "/ships" do
    {:ok, body, conn} = read_body(conn)
    body = Poison.decode!(body)

    [body, code] = ShipHandler.insert_new_ships(body)

    body = Poison.encode!(body)
    send_resp(conn, code, body)
  end

  # "Default" route that will get called when no other route is matched
  match _ do
    send_resp(conn, 404, "not found")
  end
end
