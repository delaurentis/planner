#!/bin/bash

# Other scripts should be relatie to current path
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Move to the planner kubernetes context
source ${DIR}/setup/use-planner

export DOCKER_DEFAULT_PLATFORM=linux/amd64
docker-compose -f docker-compose.prod.yml up -d --build

GCP_PROJECT=$(gcloud config get-value project)
PLANNER_VERSION=`date "+%Y%m%d%s"`

docker tag planner gcr.io/$GCP_PROJECT/planner:$PLANNER_VERSION
docker push gcr.io/$GCP_PROJECT/planner:$PLANNER_VERSION
kubectl set image deployment/planner planner=gcr.io/$GCP_PROJECT/planner:$PLANNER_VERSION