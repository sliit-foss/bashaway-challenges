filename=$(find "./src" -maxdepth 1 -type f | head -n 1 | xargs basename)

if [ -z "$filename" ]; then
  echo "No file found"
  exit 0
fi

database=$(grep -oP 'CREATE DATABASE \K\w+' src/$filename)

table=$(grep -oP 'CREATE TABLE \K\w+' src/$filename)

docker stop mysql || true && docker rm mysql || true

docker run -e MYSQL_ROOT_PASSWORD='123456' -e MYSQL_ROOT_HOST='%' -d --name mysql --restart=always -p 3307:3306 mysql/mysql-server:latest

sleep 30

sudo apt-get update

sudo apt-get install -y mysql-client

docker restart mysql

docker stop mongo || true && docker rm mongo || true

docker run -d --name mongo -p 27020:27017 mongo:latest

docker restart mongo

sleep 15

docker exec mongo bash -c "mongosh --eval 'db.getSiblingDB(\"$database\").createUser({ user: \"admin\", pwd: \"3aDAl3vfeRbY1lf\", roles: [ { role: \"readWrite\", db: \"$database\" } ], passwordDigestor: \"server\" })'"

mysql --user=root --password=123456 --port=3307 --protocol=tcp < ./src/$filename

node migrate.js $database $table
