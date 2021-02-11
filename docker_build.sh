#!/bin/bash

TAG="${1:-latest}"
ALIYUN_REPO=registry.cn-hangzhou.aliyuncs.com/zingzeu
echo $TAG

mkdir -p serverbuild
cp -rf ./server serverbuild/
cp -rf ./thirdparty serverbuild/

# Server image (just one for now)
#docker build -f docker/yngdieng-backend/Dockerfile -t ztl8702/yngdieng-backend:$TAG ./serverbuild
#docker tag ztl8702/yngdieng-backend:$TAG $ALIYUN_REPO/yngdieng-backend:$TAG

# All-in-one image (for Functions)
docker build -f docker/yngdieng-mono/Dockerfile -t ztl8702/yngdieng-mono:$TAG ./serverbuild 
docker tag ztl8702/yngdieng-mono:$TAG $ALIYUN_REPO/yngdieng-mono:$TAG

rm -rf serverbuild
