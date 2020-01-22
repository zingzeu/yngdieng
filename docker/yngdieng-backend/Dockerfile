# context: /<workspace>/server
FROM mcr.microsoft.com/dotnet/core/sdk:3.1 as builder
RUN mkdir /build
RUN mkdir /out
WORKDIR /build
COPY . /build/
RUN dotnet publish -o /out backend/Yngdieng.Backend.csproj

# ztl8702/yngdieng-backend
# Build runtime image
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1
WORKDIR /app
COPY --from=builder /out .
ENTRYPOINT ["dotnet", "Yngdieng.Backend.dll","--IndexFile=/data/yngdieng_index.bin"]
