copy_files() {
    local src_dir="$1"
    local dest_dir="$2"

    for item in "$src_dir"/*; do
        if [ -f "$item" ]; then
            base_name=$(basename "$item")
            extension="${base_name##*.}"
            filename="${base_name%.*}"
            new_name="${filename}_clone.${extension}"
        else
            new_name=$(basename "$item")
        fi
        if [ -d "$item" ]; then
            mkdir -p "$dest_dir/$new_name"
            copy_files "$item" "$dest_dir/$new_name"
        else
            cp "$item" "$dest_dir/$new_name"
        fi
    done
}

destination="./out"

rm -rf $destination && mkdir -p "$destination"

copy_files "./src" "$destination"