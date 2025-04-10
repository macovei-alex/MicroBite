FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS base
WORKDIR /app
EXPOSE 5095
RUN apk add --no-cache postgresql-client

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Debug
WORKDIR /src
COPY ./AuthServer/AuthServer.csproj ./AuthServer/
RUN dotnet restore ./AuthServer/AuthServer.csproj
COPY . .
WORKDIR /src/AuthServer
RUN dotnet build AuthServer.csproj -c ${BUILD_CONFIGURATION} -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Debug
RUN dotnet publish AuthServer.csproj -c ${BUILD_CONFIGURATION} -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY --from=build /src/AuthServer/dev/* ./dev/
COPY ./AuthServer/certs/localhost.pfx /app/certs/localhost.pfx
ENV ASPNETCORE_URLS=https://0.0.0.0:7261
ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/app/certs/localhost.pfx
ENV ASPNETCORE_Kestrel__Certificates__Default__Password="dev-cert-password"
ENTRYPOINT [ "dotnet", "AuthServer.dll" ]
