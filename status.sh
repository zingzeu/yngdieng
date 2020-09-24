#!/bin/bash
echo "CURRENT_TIME $(date +%s)"
git_hash=$(git rev-parse HEAD)
echo "STABLE_GIT_COMMIT $git_hash"
echo "STABLE_GIT_COMMIT_SHORT ${git_hash:0:8}"
echo "BUILD_TAG ${git_hash:0:8}"
