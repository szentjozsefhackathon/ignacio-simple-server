FROM node:16 AS build

# Install Flutter SDK
RUN apt-get update && apt-get install -y wget unzip
RUN wget https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.13.4-stable.tar.xz
RUN tar xf flutter_linux_3.13.4-stable.tar.xz && mv flutter /opt/flutter
ENV PATH="/opt/flutter/bin:/opt/flutter/bin/cache/dart-sdk/bin:${PATH}"

# Clone and build Flutter app
WORKDIR /app
RUN git clone https://github.com/Golar24/ignacio_prayers_flutter_application.git .
RUN flutter build web

# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/build/web/ /usr/share/nginx/html
EXPOSE 80