# MicroBite

## Instructiuni

```bash
# aducerea codului sursa
git clone https://github.com/macovei-alex/MicroBite && cd MicroBite

# construirea containerelor si pornirea, respectiv configurarea serverelor de baze de date
# erori de la API-uri sunt de asteptat
# nu opriti operatia pana nu vedeti mesajul:
#     ... [1] LOG:  database system is ready to accept connections
# de la ambele servere de baze de date
docker compose up --build

# opriti containerele atasate cu Ctrl+C sau `docker compose down`

# porniti toate containerele din nou
# ar trebui sa se faca fara erori
docker compose up
```

Dupa rularea instructiunilor puteti deschide URL-ul http://localhost:5173/login in browser. De aici fie puteti sa va conectati folosind contul implicit generat de administrator (email: admin@admin.com, password: adminadmin), ori puteti sa va creati un cont nou de utilizator dand clic pe "Register here".

Implicit exista cateva produse adaugate la prima pornire a API-ului de resurse.
