# FROM HERE
# https://kubernetes.io/docs/concepts/services-networking/connect-applications-service/

skubectl2 create secret tls planner-tls-certificate --key nginx/nginx.key --cert nginx/nginx.crt