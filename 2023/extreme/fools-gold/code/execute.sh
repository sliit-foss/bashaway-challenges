docker stop mysql || true && docker rm mysql || true

docker run -e MYSQL_ROOT_PASSWORD='fools-gold' -e MYSQL_USER=ace -e MYSQL_PASSWORD=firefist -e MYSQL_ROOT_HOST='%' -e MYSQL_DATABASE=vault -d --name mysql --restart=always -p 3307:3306 mysql/mysql-server:latest

sudo apt-get update

sudo apt-get install -y mysql-client

docker exec mysql /bin/sh -c "echo 'max_connections = 2' >> /etc/my.cnf"

sleep 30

sql="USE vault;
CREATE TABLE gold (id INT NOT NULL AUTO_INCREMENT, name VARCHAR(255) NOT NULL, value INT NOT NULL, PRIMARY KEY (id));
INSERT INTO gold (name, value) VALUES ('gold1', 100);
INSERT INTO gold (name, value) VALUES ('gold2', 200);
INSERT INTO gold (name, value) VALUES ('gold3', 300);
INSERT INTO gold (name, value) VALUES ('gold4', 400);
INSERT INTO gold (name, value) VALUES ('gold5', 500);" 

mysql --user=root --password=fools-gold --port=3307 --protocol=tcp -e "$sql"

docker restart mysql