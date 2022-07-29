# Lookup the current GCP project
GCP_PROJECT_ID=$(gcloud config get-value project)

# Create our deployment
kubectl create deployment planner --image=gcr.io/${GCP_PROJECT_ID}/planner
kubectl scale deployment planner --replicas=1
kubectl autoscale deployment planner --cpu-percent=80 --min=1 --max=1
kubectl get pods

# Create our service
kubectl apply -f kube-service.yml
kubectl get service

# Expose access to our service on port 80 and 443
# Todo: Explore if port 443 is really needed.
# Since Google Cloud is adding SSL on top, this could be duplicative.
kubectl expose deployment planner --name=planner --type=LoadBalancer --port 80 --target-port 80
kubectl expose deployment planner --name=planner-https --type=LoadBalancer --port 443 --target-port 443

# Optionally upload a dummy self-signed certificate between NGINX and the load balancer
# Not really necessary since all traffic is encrypted within the VPC
# Note: The real SSL certificate will be created and managed by Google Cloud
# kubectl create secret tls planner-tls-certificate --key nginx/dummy.key --cert nginx/dummy.crt

# This needs the project ID, is likely optional
# It does set port 80, and more testing is needed
# to determine if this is absolutely necessary
# If you have problems, try uncommenting:
# kubectl apply -f kube-deployment.yml
# kubectl get deployment

kubectl apply -f kube-certificate.yml
kubectl get managedcertificate
kubectl apply -f kube-ingress.yml
kubectl get ingress

# [Resources]
# FROM: https://cloud.google.com/kubernetes-engine/docs/how-to/managed-certs
# AND: https://blog.francium.tech/using-google-managed-certificate-with-kubernetes-ingress-d96614fe8ddf

