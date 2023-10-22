# Start Install Google Chrome (You may comment out these lines during local testing if you already have Chrome installed)

sudo apt update

wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo dpkg -i google-chrome-stable_current_amd64.deb

sudo apt-get install -f

rm google-chrome-stable_current_amd64.deb

# End Install Google Chrome

# Write your code here