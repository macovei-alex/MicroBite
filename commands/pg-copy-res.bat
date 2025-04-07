@echo off
setlocal
set "basedir=%~dp0.."
set PGPASSWORD=1q2w3e
pg_dump -U postgres -h localhost -d MicroBiteResources -F c -b -v -f "%basedir%/data/pg-res-data/app/microbiteres.dump"
docker exec -it microbite-res-db-1 bash -c "chmod +x pg-restore-res.sh && ./pg-restore-res.sh"
endlocal
