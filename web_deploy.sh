bazel build --config=release //web/src:prodapp //web/src:staging_app && \
~/ossutil64 cp -rf dist/bin/web/src/prodapp/ oss://yngdieng-web-prod/ && \
~/ossutil64 cp -rf dist/bin/web/src/staging_app/ oss://yngdieng-web-staging/
