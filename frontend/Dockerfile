FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM nginx:alpine

RUN apk add --no-cache wget

COPY --from=builder /app/build /usr/share/nginx/html

COPY --from=builder /app/public/icon_foreground.png /usr/share/nginx/html/
COPY --from=builder /app/public/icon_background.png /usr/share/nginx/html/
COPY --from=builder /app/public/favicon.ico /usr/share/nginx/html/
COPY --from=builder /app/public/icon-192.png /usr/share/nginx/html/
COPY --from=builder /app/public/icon-512.png /usr/share/nginx/html/
COPY --from=builder /app/public/icon.png /usr/share/nginx/html/
COPY --from=builder /app/public/icon_monochrome.png /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
