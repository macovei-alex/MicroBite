@echo off
setlocal
set "basedir=%~dp0.."
set PGPASSWORD=1q2w3e
pg_dump -U postgres -h localhost -d MicroBiteAuth -F c -b -v -f "%basedir%/data/pg-auth-data/app/microbiteauth.dump"
docker exec -it microbite-auth-db-1 bash -c "chmod +x pg-restore-auth.sh && ./pg-restore-auth.sh"
endlocal
