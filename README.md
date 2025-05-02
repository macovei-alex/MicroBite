# MicroBite

git clone https://github.com/macovei-alex/MicroBite/tree/main
cd MicroBite

openssl req -x509 -newkey rsa:2048 -nodes -keyout localhost.key -out localhost.crt -days 365 -subj "/CN=localhost"
openssl pkcs12 -export -out localhost.pfx -inkey localhost.key -in localhost.crt -passout pass:dev-cert-password
copy localhost.pfx backend\AuthServer\AuthServer\certs\localhost.pfx
copy localhost.pfx backend\ResourceServer\ResourceServer\certs\localhost.pfx
del localhost.pfx localhost.crt localhost.key

docker compose up --build
