FROM node:13.1-alpine as build

WORKDIR /web
COPY ./web/package*.json ./
RUN npm i
COPY ./web ./
RUN npm run build

# Stage - Production
FROM nginx:1.17-alpine
COPY --from=build /web/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
