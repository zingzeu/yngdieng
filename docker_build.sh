#!/bin/bash

TAG="${1:-latest}"
echo $TAG
# Prod web image
mkdir -p ./.build/yngdieng-web-prod
bazel build //web/src:prodapp
cp -r ./dist/bin/web/src/prodapp ./.build/yngdieng-web-prod/
cp -r ./docker/yngdieng-web-prod/nginx.conf ./.build/yngdieng-web-prod/
docker build -f docker/yngdieng-web-prod/Dockerfile -t ztl8702/yngdieng-web-prod:$TAG ./.build/yngdieng-web-prod

# # Dev web image
# #mkdir -p ./.build/yngdieng-web-dev
# #bazel build //web/src:devapp_release
# #cp -r ./dist/bin/web/src/devapp_release ./.build/yngdieng-web-dev/
# #cp -r ./docker/yngdieng-web-dev/nginx.conf ./.build/yngdieng-web-dev/nginx.conf
# #docker build -f docker/yngdieng-web-dev/Dockerfile -t ztl8702/yngdieng-web-dev:$TAG ./.build/yngdieng-web-dev

# Server image (just one for now)
docker build -f docker/yngdieng-backend/Dockerfile -t ztl8702/yngdieng-backend:$TAG ./server
