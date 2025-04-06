FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5095

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
ENV ASPNETCORE_URLS=http://0.0.0.0:5095
ENV ASPNETCORE_ENVIRONMENT=Development
ENTRYPOINT [ "dotnet", "AuthServer.dll" ]
