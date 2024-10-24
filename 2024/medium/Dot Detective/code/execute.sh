mkdir -p out

json=$(cat src/chaos.json)

dot() {
  local prefix="$1"
  local json="$2"
  for key in $(jq -r 'keys_unsorted[]' <<< "$json"); do
    value=$(jq -c --arg k "$key" '.[$k]' <<< "$json")
    if jq -e . <<< "$value" &>/dev/null; then
      if [[ "$value" == "null" ]]; then
        echo "{\"${prefix}${key}\":null}"
      elif jq -e 'type == "object" or type == "array"' <<< "$value" &>/dev/null; then
        dot "${prefix}${key}." "$value" 
      else
        echo "\"${prefix}${key}\":${value}",
      fi
    fi
  done
}

output=$(echo $(dot "" "$json" ) | sed 's/,$//')

echo "{${output}}" > out/transformed.json