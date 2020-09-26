import Config
config :logger,
  backends: [:console],
  utc_log: :true
  # compile_time_purge_matching: [
  #   [application: :sea_battle_server, level_lower_than: :debug]
  # ],

config :logger, :console,
  format: "\n>>  UTC $time [$level] $levelpad$message\n$metadata\n",
  metadata: :all,
  level: :debug
