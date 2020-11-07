# context: /<workspace>/server
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 as builder
RUN mkdir /build
RUN mkdir /out
WORKDIR /build
COPY . /build/
RUN dotnet publish -o /out backend/Yngdieng.Backend.csproj

# This image does not exist in Docker Hub. It needs to be loaded into the
# local Docker daemon with:
# bazel run //assets:tts_audio_wav_image
FROM bazel/assets:tts_audio_wav_image AS audio_files
# Do nothing

# ztl8702/yngdieng-backend
# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Copy TTS source files
RUN mkdir -p /data/tts_audio_wav
COPY --from=audio_files /*.wav /data/tts_audio_wav/

# Copy server binary
WORKDIR /app
COPY --from=builder /out .
ENTRYPOINT ["dotnet", "Yngdieng.Backend.dll", \
    "--IndexPath=/data/hotswap/", \
    "--TtsAudioFolder=/data/tts_audio_wav/"]

HEALTHCHECK --start-period=10s \
    --interval=30s \
    --timeout=10s \
    CMD curl --http2-prior-knowledge --fail http://localhost:5001/healthz || exit 1
