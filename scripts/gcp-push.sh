PLANNER_VERSION=`date "+%Y%m%d%s"`
docker tag planner gcr.io/staging-XX/planner:$PLANNER_VERSION
docker push gcr.io/staging-XX/planner:$PLANNER_VERSION
skubectl2 set image deployment/planner planner=gcr.io/staging-XX/planner:$PLANNER_VERSION
