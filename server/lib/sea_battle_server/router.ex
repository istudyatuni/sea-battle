defmodule SeaBattleServer.Router do
  import Plug.Conn
  use Plug.Router
  use Plug.Debugger

  alias SeaBattleServer.ShipHandler
  use Application

  require Logger
  plug(Plug.Logger, log: :debug)

  plug(:match)
  plug(:dispatch)

  get "/shot" do
    conn = fetch_query_params(conn)
    %{"id" => id, "x" => x, "y" => y} = conn.params

    [key, msg, code] = ShipHandler.hit_or_miss(id, x, y)
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

    [body, code] = ShipHandler.get_opponent_id(id)

    body = Poison.encode!(body)
    send_resp(conn, code, body)
  end

  get "/move" do
    conn = fetch_query_params(conn)
    %{"id" => id} = conn.params

    [body, code] = ShipHandler.can_move?(id)

    body = Poison.encode!(body)
    send_resp(conn, code, body)
  end

  patch "/opponent" do
    conn = fetch_query_params(conn)
    %{"id" => id, "opponentID" => opponent_id} = conn.params

    [body, code] = ShipHandler.set_opponent(id, opponent_id)

    body = Poison.encode!(body)
    send_resp(conn, code, body)
  end

  post "/log" do
    {:ok, body, conn} = read_body(conn)
    body = Poison.decode!(body)

    Logger.info("Client error: #{inspect(body)}")

    send_resp(conn, 204, "")
  end

  ### WEB APP STATIC FILES ###

  def prod?() do
    env = Application.get_env(:sea_battle_server, :env)

    if env == :prod or env == :test do
      true
    else
      false
    end
  end

  get "/" do
    if prod?() do
      conn
      |> put_resp_header("content-type", "text/html; charset=utf-8")
      |> send_file(200, "/web/dist/index.html")
    else
      send_resp(conn, 200, "Server running in dev mode, no web application here")
    end
  end

  def send_static_file(conn, folder, filename, mime_type) do
    if prod?() do
      if File.exists?("#{folder}/#{filename}") do
        conn
        |> put_resp_header("content-type", "#{mime_type}; charset=utf-8")
        |> send_file(200, "#{folder}/#{filename}")
      else
        send_resp(conn, 404, "Not found")
      end
    else
      send_resp(conn, 500, "Server running in dev mode, no web application here")
    end
  end

  def route_root_folder(conn, name) do
    mime_types = %{
      "ico" => "image/vnd.microsoft.icon",
      "json" => "application/json",
      "txt" => "text/plain",
      "js" => "application/javascript"
    }

    ext = Regex.scan(~r/[\da-zA-Z\-\.]+\.([a-z]+)/, name) |> hd |> tl |> hd
    send_static_file(conn, "/web/dist", name, mime_types[ext])
  end

  get "assets/:name" do
    # extract from smth like [["name.png", "png"]]
    ext = Regex.scan(~r/[\da-zA-Z]+\.([a-z]+)/, name) |> hd |> tl |> hd
    send_static_file(conn, "/web/dist/assets", name, "image/#{ext}; charset=utf-8")
  end

  get "static/js/:name" do
    send_static_file(conn, "/web/dist/static/js", name, "application/javascript")
  end

  get "static/css/:name" do
    send_static_file(conn, "/web/dist/static/css", name, "text/css")
  end

  # "Default" route that will get called when no other route is matched
  match _ do
    path = conn.path_info |> hd

    if String.match?(path, ~r/[\S]+\.[a-zA-Z]/) do
      route_root_folder(conn, path)
    else
      send_resp(conn, 404, "Not found")
    end
  end
end
