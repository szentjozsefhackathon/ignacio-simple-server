FROM node:16 AS build

# Install Flutter SDK
RUN apt-get update && apt-get install -y wget unzip xz-utils
RUN wget --no-cache https://storage.googleapis.com/flutter_infra_release/releases/stable/linux/flutter_linux_3.24.5-stable.tar.xz
RUN tar xf flutter_linux_3.24.5-stable.tar.xz && mv flutter /opt/flutter
ENV PATH="/opt/flutter/bin:/opt/flutter/bin/cache/dart-sdk/bin:${PATH}"


# Configure Git to allow dubious ownership
RUN git config --global --add safe.directory /opt/flutter

# Clone and build Flutter app
WORKDIR /app
RUN flutter doctor -v

# Clone the Flutter app repository
RUN echo "Cloning Ignacio Prayers Flutter Application"
RUN git clone https://github.com/szentjozsefhackathon/ignacio_prayers_flutter_application.git
WORKDIR /app/ignacio_prayers_flutter_application

# Fetch dependencies
RUN flutter pub get

# Debug project directory structure
# RUN ls -R /app/ignacio_prayers_flutter_application

# Build the app
RUN flutter build web --base-href="/flutter/"

# Debug build output
# RUN ls -R /app/ignacio_prayers_flutter_application/build/web

# Serve with Nginx
FROM nginx:alpine
COPY --from=build /app/ignacio_prayers_flutter_application/build/web/ /usr/share/nginx/html
EXPOSE 80