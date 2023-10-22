pnpm i -g pm2

pm2 delete network-sorcery

pm2 start src/server.js --name network-sorcery -f

# Write your code here