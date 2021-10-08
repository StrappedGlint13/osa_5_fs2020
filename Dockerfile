FROM node:alpine AS builder

WORKDIR /usr/src/app

COPY . .

RUN npm run build

FROM nginx:1.19

EXPOSE 3000

COPY --from=builder /usr/src/app/build /usr/share/nginx/html