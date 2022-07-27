# FROM HERE
# https://kubernetes.io/docs/concepts/services-networking/connect-applications-service/

kubectl create secret tls planner-tls-certificate --key nginx/dummy.key --cert nginx/dummy.crt