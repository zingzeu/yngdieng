#!/bin/bash
ASPNETCORE_ENVIRONMENT=Production
echo Starting Yngdieng.Backend...
dotnet run -p server/backend/Yngdieng.Backend.csproj -- --IndexPath=../../output/ --TtsAudioFolder=../../dist/bin/assets/tts_audio/ $@
