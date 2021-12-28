bazel build --config=release //web/src:prodapp
cp -r dist/bin/web/src/prodapp/ dotnet/src/ZingzeuOrg.Yngdieng.Web/wwwroot
