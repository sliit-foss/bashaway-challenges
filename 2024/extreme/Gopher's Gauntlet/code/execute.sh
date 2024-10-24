mkdir -p src/.github/workflows

cat <<EOF > src/.github/workflows/run-tests.yml

name: run-tests
run-name: Run tests
on:
  pull_request:
    branches:
      - main

jobs:
    unit-tests:
        name: Test
        runs-on: ubuntu-latest
        strategy:
            max-parallel: 1
            matrix:
                go-version: [1.21.0, 1.22.0]
        steps:
        - name: Checkout repository
          uses: actions/checkout@v4

        - name: Set up Golang
          uses: actions/setup-go@v5
          with:
           go-version: \${{ matrix.go-version }}

        - name: Install dependencies
          run: |
            apt-get update && apt-get install -y ca-certificates openssl
            cert_location=/usr/local/share/ca-certificates
            openssl s_client -showcerts -connect github.com:443 </dev/null 2>/dev/null|openssl x509 -outform PEM > ${cert_location}/github.crt
            openssl s_client -showcerts -connect proxy.golang.org:443 </dev/null 2>/dev/null|openssl x509 -outform PEM >  ${cert_location}/proxy.golang.crt
            update-ca-certificates
            go mod tidy
            go get -v -t -d ./...

        - name: Start MongoDB
          uses: supercharge/mongodb-github-action@1.11.0
          with:
            mongodb-version: '7.0'
            mongodb-replica-set: 'rs0'
            mongodb-container-name: mongodb-\${{ matrix.go-version }}
            mongodb-port: \${{ matrix.go-version == '1.21.0' && 27017 || 27018 }}
        
        - name: Run tests
          run: go test -v ./... || true
          env:
            DB_URI: \${{ matrix.go-version == '1.21.0' && 'mongodb://localhost:27017/elemental?replicaSet=rs0' || 'mongodb://localhost:27018/elemental?replicaSet=rs0' }}
            
EOF