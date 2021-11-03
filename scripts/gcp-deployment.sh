skubectl2 create deployment planner --image=gcr.io/staging-XXX/planner
skubectl2 scale deployment planner --replicas=1
#skubectl2 autoscale deployment planner --cpu-percent=80 --min=1 --max=1
skubectl2 get pods