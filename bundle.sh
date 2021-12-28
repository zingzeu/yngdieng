bazel build --config=release //web/src:prodapp
cp -rf dist/bin/web/src/prodapp/ dotnet/src/ZingzeuOrg.Yngdieng.Web/wwwroot
