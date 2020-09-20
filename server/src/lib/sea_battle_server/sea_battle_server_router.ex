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
  def init_all_ships() do
    IO.puts("Init ships . .")
    all_ships = @all_ships
    ^all_ships = :ets.new(all_ships, [:public, :named_table, read_concurrency: true])
  end

  def insert_new_ships(ships) do
    # if table not exist
    if Enum.member?(:ets.all(), @all_ships) == false do
      init_all_ships()
    end

    true = :ets.insert_new(@all_ships, {ships["id"], ships["ships"]})
  end

  def show_ships(id) do
    IO.puts("show..")
    # if table not exist
    case :ets.whereis(@all_ships) do
      :undefined -> IO.puts("ships is undefined")
      _ -> IO.inspect(:ets.lookup(@all_ships, id))
    end
  end

  get "/ships" do
    # show_ships()
    send_resp(conn, 201, "responce")
    # battlefield = %ShipHandler{id: "-", coordinates: [0]}
    # responce = Poison.encode!(battlefield, [])
  end

  post "/ships" do
    {:ok, body, conn} = read_body(conn)
    body = Poison.decode!(body)
    insert_new_ships(body)
    show_ships(body["id"])
    send_resp(conn, 201, "created")
    # battlefield = %ShipHandler{id: "0", coordinates: body["ships"]}
  end

  # "Default" route that will get called when no other route is matched
  match _ do
    send_resp(conn, 404, "not found")
  end
end
