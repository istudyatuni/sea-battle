defmodule SeaBattleServer.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false
  @all_ships :all_ships

  use Application
  require Logger

  def start(_type, _args) do
    import Supervisor.Spec, warn: false
    port = Application.get_env(:sea_battle_server, :port)
    Logger.debug("Set port #{port}")

    children = [
      # Starts a worker by calling: SeaBattleServer.Worker.start_link(arg)
      # {SeaBattleServer.Worker, arg}
      Plug.Cowboy.child_spec(
        scheme: :http,
        plug: SeaBattleServer.Router,
        options: [
          dispatch: dispatch(),
          port: port
        ]
      ),
      Registry.child_spec(
        keys: :duplicate,
        name: Registry.SeaBattleServer
      )
    ]

    Logger.debug("Init ships . .")
    all_ships = @all_ships
    ^all_ships = :ets.new(all_ships, [:public, :named_table, read_concurrency: true])

    # in this table - can I shoot to player['id']?
    :ets.new(:can_move, [:public, :named_table, read_concurrency: true])

    # for counting, how many tables with battles already exist
    :ets.insert_new(@all_ships, {"number", 0})

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: SeaBattleServer.Supervisor]
    Supervisor.start_link(children, opts)
  end

  defp dispatch do
    [
      {:_,
       [
         {"/ws/opponent/[...]", SeaBattleServer.SocketHandler.Opponent, []},
         {"/ws/moves/[...]", SeaBattleServer.SocketHandler.Moves, []},
         {:_, Plug.Cowboy.Handler, {SeaBattleServer.Router, []}}
       ]}
    ]
  end
end
