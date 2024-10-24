curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null \

echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list 

sudo apt update && sudo apt install ngrok

npm install --global verdaccio serve

verdaccio --listen 0.0.0.0:6873 &

ngrok config add-authtoken 2kPSfYnbf4ozffa7TyHVWwI6Fm8_5WW2eADY7YHuSEmQevNNj

echo "server {
    listen 8000 default_server;
    listen [::]:8000 default_server;

    location / {
        proxy_pass http://127.0.0.1:3000;
    }
    location /registry/ {
        proxy_pass http://127.0.0.1:6873/;
    }
}" | sudo tee /etc/nginx/conf.d/default.conf > /dev/null

sudo systemctl restart nginx

sudo systemctl status nginx

ngrok http 8000 --log=stdout > /dev/null &

sleep 2

ngrokURL=$(curl --silent --max-time 10 http://localhost:4040/api/tunnels | jq -r '.tunnels[0].public_url')

registryURL=$ngrokURL/registry

echo $registryURL

echo $ngrokURL

echo "127.0.0.1  packages.sliitfoss.org" | sudo tee -a /etc/hosts

cd src

nohup serve  &

git init

git config user.email "github-actions[bot]@users.noreply.github.com"

git config user.name "github-actions[bot]"

mkdir -p .github/workflows

cat <<EOF > .github/workflows/launch.yml

name: launch-sequnce
run-name: Launch Sequence
on:
  push:
    branches:
      - main
jobs:
    publish:
        name: Publish
        runs-on: ubuntu-latest
        steps:
        - uses: actions/setup-node@v4
          with:
            node-version: 18

        - name: Checkout code
          run: |
            apt-get update
            apt-get install -y curl expect
            curl $ngrokURL/index.js > index.js
            curl $ngrokURL/package.json > package.json
            curl $ngrokURL/.npmrc > .npmrc
            curl $registryURL > response.txt
            cat response.txt

        - name: Install dependencies
          run: npm i

        - name: Publish package
          run: |
            cat << 'EOF' > login.sh
            #!/bin/bash

            set username "bashaway"
            set password "bashaway"
            set registry "$registryURL"

            spawn npm login --auth-type=legacy --registry=\$registry

            expect "Username:"
            send "\$username\r"

            expect "Password:"
            send "\$password\r"

            expect eof
            EOF

            chmod +x login.sh

            expect login.sh

            cat ~/.npmrc
            npm publish --registry=$registryURL
EOF

cat <<EOF > .git/hooks/post-commit
#!/bin/bash

commit_message=\$(git log -1 --pretty=%B)

if [[ \$commit_message == release:* ]]; then
    echo "Releasing package"
    act -P ubuntu-22.04=catthehacker/ubuntu:full-22.04
fi

EOF

sudo chmod +x .git/hooks/post-commit