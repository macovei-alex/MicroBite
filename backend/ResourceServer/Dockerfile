FROM mcr.microsoft.com/dotnet/aspnet:9.0-alpine AS base
WORKDIR /app
EXPOSE 5247
RUN apk add --no-cache postgresql-client

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Debug
WORKDIR /src
COPY ./ResourceServer/ResourceServer.csproj ./ResourceServer/
RUN dotnet restore ./ResourceServer/ResourceServer.csproj
COPY . .
WORKDIR /src/ResourceServer
RUN dotnet build ResourceServer.csproj -c ${BUILD_CONFIGURATION} -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Debug
RUN dotnet publish ResourceServer.csproj -c ${BUILD_CONFIGURATION} -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
COPY ./ResourceServer/certs/localhost.pfx /app/certs/localhost.pfx
ENV ASPNETCORE_URLS=https://0.0.0.0:7039
ENV ASPNETCORE_ENVIRONMENT=Development
ENV ASPNETCORE_Kestrel__Certificates__Default__Path=/app/certs/localhost.pfx
ENV ASPNETCORE_Kestrel__Certificates__Default__Password="dev-cert-password"
ENTRYPOINT [ "dotnet", "ResourceServer.dll" ]
