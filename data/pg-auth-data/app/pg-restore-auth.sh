#!/usr/bin/bash

PG_HOST="localhost"
PG_PORT="5432"
PG_USER="postgres"
PG_DB="MicroBiteAuth"
PG_PASSWORD="1q2w3e"

export PGPASSWORD=$PG_PASSWORD

psql -h $PG_HOST -p $PG_PORT -U $PG_USER -d $PG_DB -t -c "SELECT 'DROP TABLE IF EXISTS \"' || tablename || '\" CASCADE;' FROM pg_tables WHERE schemaname = 'public';" | psql -h $PG_HOST -p $PG_PORT -U $PG_USER -d $PG_DB

unset PGPASSWORD

pg_restore -U postgres -d MicroBiteAuth microbiteauth.dump

echo ""
echo "[INF]: If you don't see any errors, the database has been restored successfully."
