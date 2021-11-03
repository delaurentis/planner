#skubectl2 expose deployment planner --name=planner --type=LoadBalancer --port 80 --target-port 80
skubectl2 expose deployment planner --name=planner-https --type=LoadBalancer --port 443 --target-port 443
skubectl2 get service