mkdir -p out

write_random_number() {
    while true; do
        echo $((RANDOM % 100 + 1)) >> ./out/numbers.txt
        sleep 1
    done
}

# Call the function in the background
write_random_number &