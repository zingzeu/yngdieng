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

FROM mcr.microsoft.com/dotnet/aspnet:6.0-alpine
RUN mkdir /app
COPY --from=builder /publish /app
WORKDIR /app
ENV ASPNETCORE_FORWARDEDHEADERS_ENABLED true
ENV Logging__Console__FormatterName ''
ENTRYPOINT ["dotnet", "ZingzeuOrg.Yngdieng.Web.dll"]
