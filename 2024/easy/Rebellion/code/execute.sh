jq "del(.$1)" ./src/courtroom.json > ./src/courtroom.json.tmp && mv ./src/courtroom.json.tmp ./src/courtroom.json