if [ -z "$(lsof -i:11001)" ]; then
    echo "Server 1 is not running"
    exit 0;
fi

if [ -z "$(lsof -i:11002)" ]; then
    echo "Server 2 is not running"
    exit 0;
fi

if [ -z "$(lsof -i:11003)" ]; then
    echo "Server 3 is not running"
    exit 0;
fi

echo "upstream backend {
        server 127.0.0.1:11001;
        server 127.0.0.1:11002;
        server 127.0.0.1:11003;
    }

    server {
        listen      11000;
        listen      [::]:11000;
        server_name 127.0.0.1;

        location / {
	        proxy_redirect      off;
	        proxy_set_header    X-Real-IP \$remote_addr;
	        proxy_set_header    X-Forwarded-For \$proxy_add_x_forwarded_for;
	        proxy_set_header    Host \$http_host;
		    proxy_pass http://backend;
	    }
}" | sudo tee /etc/nginx/conf.d/loadbalancer.conf > /dev/null

sudo systemctl restart nginx

sudo systemctl status nginx