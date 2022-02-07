#!/bin/bash
# Builds legacy server docker images

TAG="${1:-latest}"
ALIYUN_REPO=registry.cn-hangzhou.aliyuncs.com/zingzeu
echo $TAG

mkdir -p serverbuild
cp -rf ./server serverbuild/
cp -rf ./dotnet serverbuild/
cp -rf ./thirdparty serverbuild/

# Server image (just one for now)
docker build \
    -f docker/yngdieng-backend/Dockerfile \
    -t ztl8702/yngdieng-backend:$TAG \
    --build-arg NUGET_REGISTRY_USERNAME="$NUGET_REGISTRY_USERNAME" \
    --build-arg NUGET_REGISTRY_PASSWORD="$NUGET_REGISTRY_PASSWORD" \
    ./serverbuild
docker tag ztl8702/yngdieng-backend:$TAG $ALIYUN_REPO/yngdieng-backend:$TAG

rm -rf serverbuild