#!/bin/sh
echo "Deploying Starting"
echo "Step1: Deploy the mongoDB Image"
cd ./mongodb_instance/
bash md_deploy.sh
cd ..
echo "Step1: Deploy the data_Collector Image"
cd ./data_collection/
bash dc_deploy.sh
cd ..
echo "Step3: Deploy the Analyzer Viualizer Image"
cd ./analyzer_visualizer/
bash av_deploy.sh
cd ..
echo "App Deployed" 
