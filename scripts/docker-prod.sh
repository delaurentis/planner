#!/bin/bash
docker-compose -f docker-compose.prod.yml up -d --build

# Publish to GCP
# docker tag planner gcr.io/staging-XX/planner:$1
# docker push gcr.io/staging-XX/planner:$1
