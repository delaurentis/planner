gcloud compute addresses create planner-ip  --global
gcloud compute networks create planner
gcloud compute firewall-rules create https --allow=tcp:443 --network planner --description="Allow traffic on TCP port 443"   
gcloud compute firewall-rules create http --allow=tcp:80 --network planner --description="Allow traffic on TCP port 80"   
gcloud compute networks subnets create uswest --network=planner --range=10.10.0.0/24 --region=us-west4

gcloud container clusters create planner-cluster --network planner --subnetwork uswest
gcloud compute instances list
gcloud container clusters resize planner-cluster --node-pool default-pool --num-nodes 2
gcloud compute instances list

# We could use this to pass the project ID to later kubernetes commands
# GCP_PROJECT_ID=$(gcloud config get-value project)
