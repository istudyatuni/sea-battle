defmodule SeaBattleServer.Router do
  import Plug.Conn
  use Plug.Router
  use Plug.Debugger

  alias SeaBattleServer.ShipHandler

  require Logger
  plug(Plug.Logger, log: :debug)

  plug(:match)
  plug(:dispatch)

  get "/shot" do
    conn = fetch_query_params(conn)
    %{"id" => id, "x" => x, "y" => y} = conn.params

    [key, msg, code] = ShipHandler.hitOrMiss(id, x, y)
    ans = %{"id" => id, key => msg}

    ans = Poison.encode!(ans, [])
    send_resp(conn, code, ans)
  end

  post "/ships" do
    {:ok, body, conn} = read_body(conn)
    body = Poison.decode!(body)

    [body, code] = ShipHandler.insert_new_ships(body)

    body = Poison.encode!(body)
    send_resp(conn, code, body)
  end

  get "/opponent" do
    conn = fetch_query_params(conn)
    %{"id" => id} = conn.params

    [body, code] = ShipHandler.getOpponentID(id)

    body = Poison.encode!(body)
    send_resp(conn, code, body)
  end

  patch "/opponent" do
    conn = fetch_query_params(conn)
    %{"id" => id, "opponentID" => opponentID} = conn.params

    [body, code] = ShipHandler.set_opponent(id, opponentID)

    body = Poison.encode!(body)
    send_resp(conn, code, body)
  end

  post "/log" do
    {:ok, body, conn} = read_body(conn)
    body = Poison.decode!(body)

    Logger.info("Client error: #{inspect(body)}")

    send_resp(conn, 204, "")
  end

  # "Default" route that will get called when no other route is matched
  match _ do
    send_resp(conn, 404, "not found")
  end
end
