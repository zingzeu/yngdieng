```
bazel build --workspace_status_command=$(pwd)/status.sh --stamp //web/src:prodapp
~/ossutil64 cp -rf dist/bin/web/src/prodapp/ oss://yngdieng-web-prod/
```

```
bazel build --workspace_status_command=$(pwd)/status.sh --stamp //web/src:staging_app
~/ossutil64 cp -rf dist/bin/web/src/staging_app/ oss://yngdieng-web-staging/
```
