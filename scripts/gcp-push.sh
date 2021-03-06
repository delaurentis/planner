GCP_PROJECT=$(gcloud config get-value project)
PLANNER_VERSION=`date "+%Y%m%d%s"`
docker tag planner gcr.io/$GCP_PROJECT/planner:$PLANNER_VERSION
docker push gcr.io/$GCP_PROJECT/planner:$PLANNER_VERSION
kubectl set image deployment/planner planner=gcr.io/$GCP_PROJECT/planner:$PLANNER_VERSION
