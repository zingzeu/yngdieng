#!/bin/bash
ASPNETCORE_ENVIRONMENT=Production
echo Starting Yngdieng.Backend...
dotnet run -p server/backend/Yngdieng.Backend.csproj -- --IndexFile=../../output/yngdieng_index.bin $@
