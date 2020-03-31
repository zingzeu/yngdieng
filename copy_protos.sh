#!/bin/bash

# Copy protos to csharp build project

mkdir -p ./server/protos/shared/
mkdir -p ./server/protos/shared/zingzeudata/
cp ./shared/*.proto ./server/protos/shared/
cp ./shared/zingzeudata/*.proto ./server/protos/shared/zingzeudata/
