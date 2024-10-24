encode() {
    local string="${1}"
    local encoded=""
    local pos
    local c
    local o
    for (( pos=0; pos<${#string}; pos++ )); do
        c=${string:$pos:1}
        case "$c" in
        # - _ . ! ~ * ' ( )
            [a-zA-Z0-9.~-\#!*\'\(\)_]) 
                o="$c"
                ;;
            *) 
                o=$(printf '%%%02X' "'$c")
                ;;
        esac
        encoded+="$o"
    done

    echo "$encoded"
}

echo $(encode "$1")