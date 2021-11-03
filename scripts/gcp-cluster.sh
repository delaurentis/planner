gcloud config set project staging-XX
gcloud config set compute/zone us-central1 
gcloud container clusters create planner-cluster --network staging --subnetwork uscentral
gcloud compute instances list

