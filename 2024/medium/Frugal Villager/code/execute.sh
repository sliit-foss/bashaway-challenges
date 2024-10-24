minikube start

kubectl create ns bashaway

helm install redis oci://registry-1.docker.io/bitnamicharts/redis -n bashaway

sleep 45

kubectl port-forward svc/redis-master 6381:6379 -n bashaway &