# context: /<workspace>/server
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 as builder
RUN mkdir /build
RUN mkdir /out
WORKDIR /build
COPY . /build/
RUN dotnet publish -o /out server/backend/Yngdieng.Backend.csproj

# bazel run //server/gateway:image
FROM bazel/server/gateway:image AS gateway

# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Copy gateway binary 
RUN mkdir -p /app/server/gateway
RUN mkdir -p /app/server/backend
COPY --from=gateway /app/server/gateway /app/server/gateway

# Copy backend binary
COPY --from=builder /out /app/server/backend

ADD https://github.com/just-containers/s6-overlay/releases/download/v2.2.0.1/s6-overlay-amd64-installer /tmp/
RUN chmod +x /tmp/s6-overlay-amd64-installer && /tmp/s6-overlay-amd64-installer /

COPY ./etc /etc

ENTRYPOINT ["/init"]
