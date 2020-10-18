FROM node:13.1-alpine

WORKDIR /web
COPY ./web/package*.json ./
RUN npm i
COPY ./web ./
EXPOSE 3000
CMD ["npm", "start"]

FROM bitwalker/alpine-elixir:latest

WORKDIR /server
COPY ./server/mix* ./
RUN mix deps.get
COPY ./server ./
RUN mix release
CMD ["mix", "run--no-halt"]
