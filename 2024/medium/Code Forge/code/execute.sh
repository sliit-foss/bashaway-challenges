sudo apt-get install bison mercurial

bash < <(curl -LSs 'https://raw.githubusercontent.com/moovweb/gvm/master/binscripts/gvm-installer')
. "$HOME/.gvm/scripts/gvm"

gvm install go1.17.2

gvm use go1.17.2 --default

mkdir -p out

go build -o out/blade src/script.go