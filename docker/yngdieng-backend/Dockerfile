# context: /<workspace>
FROM mcr.microsoft.com/dotnet/sdk:6.0 as builder
ARG VERSION_TAG=0.0.0-placeholder
ARG NUGET_REGISTRY_USERNAME=user
ARG NUGET_REGISTRY_PASSWORD=password

RUN mkdir /build && mkdir /publish

# context REPO
COPY . /build
# Setup private registry. Some NuGet packages we use are not public.
RUN dotnet nuget add source \
    --username "$NUGET_REGISTRY_USERNAME" \
    --password "$NUGET_REGISTRY_PASSWORD" \
    --store-password-in-clear-text \
    --name github "https://nuget.pkg.github.com/zingzeu/index.json"
WORKDIR /build/server
RUN dotnet restore
WORKDIR /build/dotnet
RUN dotnet restore
WORKDIR /build/dotnet/src/ZingzeuOrg.Yngdieng.Web
RUN dotnet publish /p:InformationalVersion="$VERSION_TAG" -c Release -o /publish

# This image does not exist in Docker Hub. It needs to be loaded into the
# local Docker daemon with:
# bazel run //assets:tts_audio_wav_image
FROM bazel/assets:tts_audio_wav_image AS audio_files
# Do nothing

FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine
# Install ffmpeg
RUN apk add  --no-cache ffmpeg
# Copy TTS source files
RUN mkdir -p /data/tts_audio_wav
COPY --from=audio_files /*.wav /data/tts_audio_wav/
# Copy server binary
RUN mkdir /app
COPY --from=builder /publish /app
WORKDIR /app
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED true
ENV Logging__Console__FormatterName ''
ENTRYPOINT ["dotnet", "ZingzeuOrg.Yngdieng.Web.dll"]

