ENV_FILE=./src/.env.example
DOCKERFILE="./src/Dockerfile"

if [ ! -f "$ENV_FILE" ]; then
    exit 0
fi

replacement_content=$(awk -F= '{print "ARG " $1 "\nENV " $1 " \\$" $1 "\\n"}' $ENV_FILE | grep -v '^#' | grep -v '^\s*$')

perl -i -pe 'BEGIN {undef $/;} s/# ENVIRONMENT VARIABLE PLACEHOLDER\n/'"$replacement_content"'/s' "$DOCKERFILE"
