# Start Install Google Chrome (You may comment out these lines during local testing if you already have Chrome installed. Though the chromedriver installed here might not work with your Chrome version)

sudo apt update

wget https://mirror.cs.uchicago.edu/google-chrome/pool/main/g/google-chrome-stable/google-chrome-stable_126.0.6478.114-1_amd64.deb
sudo dpkg -i google-chrome-stable_126.0.6478.114-1_amd64

sudo apt-get install -y -f

rm google-chrome-stable_126.0.6478.114-1_amd64

# End Install Google Chrome

# Write your code here

docker build -t cybersource .

docker run -d -p 5000:8080 cybersource