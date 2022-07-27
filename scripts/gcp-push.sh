PLANNER_VERSION=`date "+%Y%m%d%s"`
docker tag planner gcr.io/planner-XX/planner:$PLANNER_VERSION
docker push gcr.io/planner-XX/planner:$PLANNER_VERSION
kubectl set image deployment/planner planner=gcr.io/planner-XX/planner:$PLANNER_VERSION
