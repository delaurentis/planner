# FROM: https://cloud.google.com/kubernetes-engine/docs/how-to/managed-certs
# AND: https://blog.francium.tech/using-google-managed-certificate-with-kubernetes-ingress-d96614fe8ddf

kubectl apply -f kube-deployment.yml
kubectl get deployment
kubectl apply -f kube-certificate.yml
kubectl get managedcertificate
kubectl apply -f kube-service.yml
kubectl get service
kubectl apply -f kube-ingress.yml
kubectl get ingress

