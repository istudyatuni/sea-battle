FROM elixir:alpine as build-env
ENV MIX_ENV=prod
WORKDIR /server
COPY ./server/mix* ./
# get hex and dependencies
RUN mix local.hex --force && mix deps.get && mix local.rebar --force
COPY ./server ./
RUN mix release

FROM node:12.18.3-alpine3.12 AS node_builder
ENV NODE_ENV="production"
WORKDIR /app
COPY ./web/package*.json ./
RUN npm install
COPY ./web ./
RUN npm run build

FROM alpine:latest
# Fix "Error loading shared library libncursesw.so.6"
RUN apk add --no-cache ncurses-dev
COPY --from=build-env /server/_build/prod/rel/sea_battle_server/ /server/
COPY --from=node_builder /app/build /web/dist

CMD ["/server/bin/sea_battle_server", "start"]
