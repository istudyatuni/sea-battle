defmodule SeaBattleServer.Routers.Static do
  use Plug.Builder

  @static_folder Path.expand(Application.get_env(:sea_battle_server, :web_app_folder))

  plug(Plug.Static,
    at: "/",
    from: @static_folder
  )

  plug(:not_found)

  def not_found(conn, _) do
    # maybe it's root request
    if conn.request_path == "/" do
      file = "#{@static_folder}/index.html"

      conn
      |> put_resp_header("content-type", "text/html; charset=utf-8")
      |> send_file(200, file)
    else
      send_resp(conn, 404, "Not found")
    end
  end
end
