defmodule SeaBattleServer.Routers.Api do
  import Plug.Conn
  use Plug.Router
  use Plug.Debugger

  alias SeaBattleServer.ShipHandler
  use Application

  require Logger
  plug(Plug.Logger, log: :debug)

  plug(:match)
  plug(:dispatch)

  get "/api/shot" do
    conn = fetch_query_params(conn)
    %{"id" => id, "x" => x, "y" => y} = conn.params

    [key, msg, code] = ShipHandler.hit_or_miss(id, x, y)
    ans = %{"id" => id, key => msg}

    ans = Poison.encode!(ans, [])
    send_resp(conn, code, ans)
  end

  post "/api/ships" do
    {:ok, body, conn} = read_body(conn)
    body = Poison.decode!(body)

    [body, code] = ShipHandler.insert_new_ships(body)

    body = Poison.encode!(body)
    send_resp(conn, code, body)
  end

  get "/api/opponent" do
    conn = fetch_query_params(conn)
    %{"id" => id} = conn.params

    [body, code] = ShipHandler.get_opponent_id(id)

    body = Poison.encode!(body)
    send_resp(conn, code, body)
  end

  get "/api/move" do
    conn = fetch_query_params(conn)
    %{"id" => id} = conn.params

    [body, code] = ShipHandler.can_move?(id)

    body = Poison.encode!(body)
    send_resp(conn, code, body)
  end

  patch "/api/opponent" do
    conn = fetch_query_params(conn)
    %{"id" => id, "opponentID" => opponent_id} = conn.params

    [body, code] = ShipHandler.set_opponent(id, opponent_id)

    body = Poison.encode!(body)
    send_resp(conn, code, body)
  end

  post "/api/log" do
    {:ok, body, conn} = read_body(conn)
    body = Poison.decode!(body)

    Logger.info("Client error: #{inspect(body)}")

    send_resp(conn, 204, "")
  end

  # "Default" route that will get called when no other route is matched
  match _ do
    send_resp(conn, 404, "Not found")
  end
end
