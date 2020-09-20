defmodule SeaBattleServer.Router do
  use Plug.Router
  use Plug.Debugger

  use SeaBattleServer.ShipHandler
  alias SeaBattleServer.ShipHandler

  require Logger
  plug(Plug.Logger, log: :debug)

  plug(:match)
  plug(:dispatch)

  @all_ships :all_ships

  def insert_new_ships(ships) do
    existance = :ets.insert_new(@all_ships, {ships["id"], ships["ships"]})

    if existance == false do
      Logger.debug("ships table already exist, id=#{ships["id"]}")
    else
      Logger.debug("inserting . .")
    end
  end

  def show_ships(id) do
    IO.puts("show..")
    # if table not exist
    case :ets.whereis(@all_ships) do
      :undefined -> IO.puts("ships is undefined")
      _ -> IO.inspect(:ets.lookup(@all_ships, id))
    end
  end

  get "/shot" do
    {:ok, body, conn} = read_body(conn)
    body = Poison.decode!(body)

    ans = ShipHandler.hitOrMiss(body["id"], body["x"], body["y"])
    responce = Poison.encode!(ans, [])
    send_resp(conn, 200, responce)
  end

  post "/ships" do
    {:ok, body, conn} = read_body(conn)
    body = Poison.decode!(body)
    insert_new_ships(body)
    send_resp(conn, 201, "created")
  end

  # "Default" route that will get called when no other route is matched
  match _ do
    send_resp(conn, 404, "not found")
  end
end
