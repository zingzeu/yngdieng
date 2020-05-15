#!/bin/bash

TAG="${1:-latest}"
echo $TAG

rm -rf ./.build

# Prod web image
mkdir -p ./.build/yngdieng-web-prod
bazel build //web/src:prodapp
cp -r ./dist/bin/web/src/prodapp ./.build/yngdieng-web-prod/
cp -r ./docker/yngdieng-web-prod/nginx.conf ./.build/yngdieng-web-prod/
docker build -f docker/yngdieng-web-prod/Dockerfile -t ztl8702/yngdieng-web-prod:$TAG ./.build/yngdieng-web-prod

# Staging web image
mkdir -p ./.build/yngdieng-web-staging
bazel build //web/src:staging_app
cp -r ./dist/bin/web/src/staging_app ./.build/yngdieng-web-staging/
cp -r ./docker/yngdieng-web-staging/nginx.conf ./.build/yngdieng-web-staging/
cp -r ./docker/yngdieng-web-staging/robots.txt ./.build/yngdieng-web-staging/
docker build -f docker/yngdieng-web-staging/Dockerfile -t ztl8702/yngdieng-web-staging:$TAG ./.build/yngdieng-web-staging

# Server image (just one for now)
docker build -f docker/yngdieng-backend/Dockerfile -t ztl8702/yngdieng-backend:$TAG ./server
