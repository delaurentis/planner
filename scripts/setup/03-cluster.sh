gcloud config set project planner-XX
gcloud config set compute/zone us-west4-a 

gcloud container clusters create planner-cluster --network planner --subnetwork uswest
gcloud compute instances list
gcloud container clusters resize planner-cluster --node-pool default-pool --num-nodes 2
gcloud compute instances list
