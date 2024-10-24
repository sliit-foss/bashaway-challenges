if [ ! -f ./src/server.cpp ]; then
    echo "File ./src/server.cpp does not exist"
    exit 0;
fi

sudo apt-get update

sudo DEBIAN_FRONTEND=noninteractive apt-get install -y g++ libboost-all-dev cmake make wget

sed -i -e 's/8080/7000/g' ./src/server.cpp

mkdir -p ./out

g++ -o ./out/server ./src/server.cpp -lboost_system -lboost_thread -lpthread -lboost_filesystem

./out/server &

echo "events {
    worker_connections 1024;
}

http {
    limit_req_zone \$binary_remote_addr zone=stampede:1m rate=5r/m;
    include /etc/nginx/conf.d/*.conf;
}" | sudo tee /etc/nginx/nginx.conf > /dev/null

echo "server {
    listen 8000 default_server;
    listen [::]:8000 default_server;
    error_page 429 = @429;
    location @429 {
        default_type application/json;
        return 429 '{"status": 429, "message": "Too Many Requests"}';
    }

    location / {
        limit_req zone=stampede burst=4 nodelay;
        limit_req_status 429; 
        proxy_pass http://127.0.0.1:7000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}" | sudo tee /etc/nginx/conf.d/default.conf > /dev/null

sudo sed -i.bak 's/^::1[[:space:]]\+localhost/# &/' /etc/hosts

sudo systemctl restart nginx

sudo systemctl status nginx
