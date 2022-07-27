gcloud config set project planner-XX
gcloud config set compute/zone us-west4-a 

gcloud compute addresses create planner-ip  --global
gcloud compute networks create planner
gcloud compute firewall-rules create https --allow=tcp:443 --network planner --description="Allow traffic on TCP port 443"   
gcloud compute firewall-rules create http --allow=tcp:80 --network planner --description="Allow traffic on TCP port 80"   
gcloud compute networks subnets create uswest --network=planner --range=10.10.0.0/24 --region=us-west4
