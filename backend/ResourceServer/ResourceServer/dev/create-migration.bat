@echo off

if "%~1"=="" (
	echo Usage: create-migration ^<migration_name^>
	exit /b 1
)

dotnet ef migrations add "%~1" && dotnet ef database update
