#!/usr/bin/bash

docker build \
    --file Dockerfile.BACKEND \
    --tag ${ECR_REGISTRY}/${ECR_BREPO_NAME}:${IMAGE_TAG} 
    .
