gcloud config set project planner-XX
gcloud config set compute/zone us-west4-a 

# Get kubectl connected to our cluster
# please rename based on actual name of cluster
export CLUSTER_NAME=planner-cluster-XX
kubectl config set-cluster ${GCP_PROJECT_ID}
kubectl config gcloud container clusters get-credentials ${GCP_PROJECT_ID}
