FROM elixir:alpine as build-env
ENV MIX_ENV=prod
WORKDIR /server
COPY ./server/mix* ./
# get hex and dependencies
RUN mix local.hex --force && mix deps.get && mix local.rebar --force
COPY ./server ./
RUN mix release

FROM node:alpine AS node_builder
ENV NODE_ENV="production" \
GENERATE_SOURCEMAP=false
WORKDIR /app
COPY ./web/package.json ./web/yarn.lock ./
RUN yarn install
COPY ./web ./
RUN yarn build

FROM alpine:latest
# Fix "Error loading shared library libncursesw.so.6"
RUN apk add --no-cache ncurses-dev
COPY --from=build-env /server/_build/prod/rel/sea_battle_server/ /server/
COPY --from=node_builder /app/build /web/dist

CMD ["/server/bin/sea_battle_server", "start"]
