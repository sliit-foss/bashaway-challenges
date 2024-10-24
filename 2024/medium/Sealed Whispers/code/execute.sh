minikube start

helm repo add sealed-secrets https://bitnami-labs.github.io/sealed-secrets 

helm install sealed-secrets sealed-secrets/sealed-secrets --namespace kube-system --version 2.16.1

KUBESEAL_VERSION='0.27.1'

curl -OL "https://github.com/bitnami-labs/sealed-secrets/releases/download/v${KUBESEAL_VERSION:?}/kubeseal-${KUBESEAL_VERSION:?}-linux-amd64.tar.gz"

tar -xvzf kubeseal-${KUBESEAL_VERSION:?}-linux-amd64.tar.gz kubeseal

rm kubeseal-${KUBESEAL_VERSION:?}-linux-amd64.tar.gz

sudo install -m 755 kubeseal /usr/local/bin/kubeseal

rm kubeseal

sleep 10