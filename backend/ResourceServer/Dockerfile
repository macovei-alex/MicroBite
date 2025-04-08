FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5247

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
ENV ASPNETCORE_URLS=http://0.0.0.0:5247
ENV ASPNETCORE_ENVIRONMENT=Development
ENTRYPOINT [ "dotnet", "ResourceServer.dll" ]
