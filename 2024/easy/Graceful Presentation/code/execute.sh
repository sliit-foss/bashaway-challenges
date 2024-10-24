if [ -z $1 ]; then
    exit 0;
fi

echo $1 | fold -w$2