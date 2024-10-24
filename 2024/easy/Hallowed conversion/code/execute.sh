mkdir -p out

jq -r '(.[0] | keys_unsorted), (.[] | [.[]]) | @csv' src/script.json > out/document.csv

sed -i 's/"//g' out/document.csv
