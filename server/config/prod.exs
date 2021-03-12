use Mix.Config

config :sea_battle_server,
  port: 80,
  env: :prod,
  web_app_folder: "/web/dist"

config :logger, :console, level: :error
