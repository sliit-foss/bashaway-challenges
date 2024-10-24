f=$(basename src/*)
mkdir -p out && gzip -c "src/$f" > "out/${f%.*}.gz"