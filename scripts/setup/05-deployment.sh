kubectl create deployment planner --image=gcr.io/planner-XX/planner
kubectl scale deployment planner --replicas=1
kubectl autoscale deployment planner --cpu-percent=80 --min=1 --max=1
kubectl get pods

kubectl expose deployment planner --name=planner --type=LoadBalancer --port 80 --target-port 80
kubectl expose deployment planner --name=planner-https --type=LoadBalancer --port 443 --target-port 443