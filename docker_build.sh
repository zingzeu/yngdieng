#!/bin/bash

TAG="${1:-latest}"
ALIYUN_REPO=registry.cn-hangzhou.aliyuncs.com/zingzeu
echo $TAG

# Server image (just one for now)
docker build -f docker/yngdieng-backend/Dockerfile -t ztl8702/yngdieng-backend:$TAG ./server
docker tag ztl8702/yngdieng-backend:$TAG $ALIYUN_REPO/yngdieng-backend:$TAG
