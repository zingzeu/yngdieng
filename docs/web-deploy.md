```
bazel build --config=release //web/src:prodapp
~/ossutil64 cp -rf dist/bin/web/src/prodapp/ oss://yngdieng-web-prod/
```

```
bazel build --config=release //web/src:staging_app
~/ossutil64 cp -rf dist/bin/web/src/staging_app/ oss://yngdieng-web-staging/
```
