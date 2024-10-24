wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu $(lsb_release -cs)/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

sudo apt-get update

sudo apt-get install -y mongodb-org

openssl genrsa -out rootCA.key 2048

openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.pem -subj "/C=LK/ST=/L=/O=/OU=/CN="

openssl genrsa -out mongodb.key 2048

openssl req -new -key mongodb.key -out mongodb.csr -subj "/C=LK/ST=/L=/O=/OU=/CN=localhost"

openssl x509 -req -in mongodb.csr -CA rootCA.pem -CAkey rootCA.key -CAcreateserial -out mongodb.crt -days 500 -sha256

cat mongodb.key mongodb.crt > mongodb.pem

sudo mv mongodb.pem /etc/ssl/mongodb.pem
sudo mv rootCA.pem /etc/ssl/rootCA.pem

rm -f mongodb.key mongodb.crt mongodb.csr rootCA.key rootCA.srl

sudo sed -i '/^net:/a\ \ ipv6: true\n\ \ ssl:\n\ \ \ \ mode: requireSSL\n\ \ \ \ PEMKeyFile: /etc/ssl/mongodb.pem\n\ \ \ \ CAFile: /etc/ssl/rootCA.pem' /etc/mongod.conf

sudo sed -i 's/bindIp: 127.0.0.1/bindIp: 127.0.0.1, ::1/' /etc/mongod.conf

sudo sed -i 's/27017/27020/g' /etc/mongod.conf

echo "MONGO_TLS_CA_FILE_PATH=/etc/ssl/rootCA.pem" >> $GITHUB_ENV
echo "MONGO_TLS_CERT_KEY_PATH=/etc/ssl/mongodb.pem" >> $GITHUB_ENV

sudo systemctl restart mongod

sudo systemctl status mongod