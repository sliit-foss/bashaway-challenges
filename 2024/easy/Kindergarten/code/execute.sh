if [ -z $1 ]
then
    exit 0
fi

if [ $(($1 % 2)) -eq 0 ]
then
    echo "Even"
else
    echo "Odd"
fi