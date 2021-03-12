use Mix.Config

config :sea_battle_server,
  port: 4001,
  env: :test,
  web_app_folder: "../web/build"

config :logger, :console, level: :info
