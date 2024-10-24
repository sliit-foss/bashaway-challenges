mkdir -p out

while IFS= read -r line || [ -n "$line" ]; do
  echo "$line" | base64 -d >> out/decoded.txt
  printf "\n" >> out/decoded.txt
done < src/codes.txt