#!/bin/bash
ASPNETCORE_ENVIRONMENT=Production
echo Starting ZingzeuOrg.Yngdieng.Web...
dotnet run -p dotnet/src/ZingzeuOrg.Yngdieng.Web/ZingzeuOrg.Yngdieng.Web.csproj -- --TtsAudioFolder=../../dist/bin/assets/tts_audio_wav_local/ $@
