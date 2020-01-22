#!/bin/bash

mkdir -p ./.build/yngdieng-web
bazel build //web/src:prodapp
cp -r ./dist/bin/web/src/prodapp ./.build/yngdieng-web/
cp -r ./docker/yngdieng-web/nginx.conf ./.build/yngdieng-web/

docker build -f docker/yngdieng-web/Dockerfile -t ztl8702/yngdieng-web ./.build/yngdieng-web


docker build -f docker/yngdieng-backend/Dockerfile -t ztl8702/yngdieng-backend ./server
