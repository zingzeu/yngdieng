#!/bin/bash

docker run --rm \
  -v $PWD/output:/data/hotswap:ro \
  -p 5000:80 \
  -p 5001:8081 \
  ztl8702/yngdieng-mono:latest