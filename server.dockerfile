FROM bitwalker/alpine-elixir:latest

ENV MIX_ENV=prod
WORKDIR /server
COPY ./server/mix* ./
RUN mix deps.get
COPY ./server ./
RUN mix release
RUN _build/dev/rel/sea_battle_server/bin/sea_battle_server start
