docker pull mongo:latest

if [ ! "$(docker ps -a | grep bashaway-2k23-cluttered)" ]; then
    docker run -d --name bashaway-2k23-cluttered -p 27207:27017 mongo
fi

# Data will be populated into the above database instance once the tests are run.

# Write your code here