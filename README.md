# MicroBite

## Instructiuni

```bash
# aducerea codului sursa
git clone https://github.com/macovei-alex/MicroBite && cd MicroBite

# construirea containerelor si pornirea, configurarea serverelor de baze de date
# erori de la API-uri sunt de asteptat
docker compose up --build

# pornirea tuturor containerelor
# ar trebui sa se faca fara erori
docker compose up
```

Dupa rularea instructiunilor puteti deschide URL-ul http://localhost:5173 in browser. De aici fie puteti sa va conectati folosind contul implicit generat de administrator (email: admin@admin.com, password: adminadmin), ori puteti sa va creati un cont nou de utilizator dand clic pe "Register here".

Implicit exista cateva produse adaugate la prima pornire a API-ului de resurse.
