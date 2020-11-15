#!/bin/bash

# Copy protos to csharp build project

mkdir -p ./server/protos/shared/
mkdir -p ./server/protos/shared/zingzeudata/
mkdir -p ./server/protos/yngdieng/admin/v1
mkdir -p ./server/protos/yngdieng/frontend/v3
cp ./shared/*.proto ./server/protos/shared/
cp ./shared/zingzeudata/*.proto ./server/protos/shared/zingzeudata/
cp ./yngdieng/admin/v1/*.proto ./server/protos/yngdieng/admin/v1
cp ./yngdieng/frontend/v3/*.proto ./server/protos/yngdieng/frontend/v3
