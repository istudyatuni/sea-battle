FROM elixir:alpine as build-env

ENV MIX_ENV=prod
WORKDIR /server
COPY ./server/mix* ./
# get hex and dependencies
RUN mix local.hex --force && mix deps.get && mix local.rebar --force
COPY ./server ./
RUN mix release

FROM node:12.18.3-alpine3.12 AS node_builder
WORKDIR /app
COPY ./web/package*.json ./
RUN npm install
COPY ./web ./
ENV NODE_ENV="production"
RUN npm run build

FROM elixir:alpine
COPY --from=build-env /server/ /server/
COPY --from=node_builder /app/build /web/dist

WORKDIR /server
CMD ["/server/_build/prod/rel/sea_battle_server/bin/sea_battle_server", "start"]
EXPOSE 8080
