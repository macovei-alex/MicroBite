@echo off
setlocal
set "basedir=%~dp0..\backend"
wt -w 0 new-tab --title "Auth Server" cmd /k "cd %basedir%\AuthServer\AuthServer && dotnet run"
wt -w 0 new-tab --title "Resource Server" cmd /k "cd %basedir%\ResourceServer\ResourceServer && dotnet run"
endlocal
