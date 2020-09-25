defmodule SeaBattleServer.Application do
  # See https://hexdocs.pm/elixir/Application.html
  # for more information on OTP Applications
  @moduledoc false
  @all_ships :all_ships
  @number_battles :number_battles

  use Application
  require Logger

  def start(_type, _args) do
    children = [
      # Starts a worker by calling: SeaBattleServer.Worker.start_link(arg)
      # {SeaBattleServer.Worker, arg}
      {Plug.Cowboy, scheme: :http, plug: SeaBattleServer.Router, options: [port: 8080]}
    ]

    Logger.debug("Init ships . .")
    all_ships = @all_ships
    ^all_ships = :ets.new(all_ships, [:public, :named_table, read_concurrency: true])

    # for counting, how many tables with battles already exist
    :ets.new(@number_battles, [:public, :named_table])
    :ets.insert_new(@number_battles, {"number", 0})

    # See https://hexdocs.pm/elixir/Supervisor.html
    # for other strategies and supported options
    opts = [strategy: :one_for_one, name: SeaBattleServer.Supervisor]
    Supervisor.start_link(children, opts)
  end
end
