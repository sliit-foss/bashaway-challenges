mkdir -p out

while IFS= read -r card_number || [ -n "$card_number" ]; do
    if [[ -n "$card_number" ]]; then
        len=${#card_number}
        last4=${card_number: -4}
        masked=$(printf "%${len}s" "$last4" | tr ' ' '*')
        masked="${masked:0:$((len-4))}$last4"
        echo "$masked" >> "./out/masked.txt"
    fi
done < "./src/parchment.txt"