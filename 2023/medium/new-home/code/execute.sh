docker pull mongo:latest

if [ ! "$(docker ps -a | grep bashaway-2k23-sunset)" ]; then
    docker run -d --name bashaway-2k23-sunset -p 27207:27017 mongo # Data will be populated into this instance once the tests are run.
fi

if [ ! "$(docker ps -a | grep bashaway-2k23-sunrise)" ]; then
    docker run -d --name bashaway-2k23-sunrise -p 27208:27017 mongo # Target instance to migrate data to.
fi

# Write your code here