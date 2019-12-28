####################################
# ESModule imports (and TypeScript imports) can be absolute starting with the workspace name.
# The name of the workspace should match the npm package where we publish, so that these
# imports also make sense when referencing the published package.
workspace(
    name = "project",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")


http_archive(
    name = "rules_proto",
    sha256 = "602e7161d9195e50246177e7c55b2f39950a9cf7366f74ed5f22fd45750cd208",
    strip_prefix = "rules_proto-97d8af4dc474595af3900dd85cb3a29ad28cc313",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_proto/archive/97d8af4dc474595af3900dd85cb3a29ad28cc313.tar.gz",
        "https://github.com/bazelbuild/rules_proto/archive/97d8af4dc474595af3900dd85cb3a29ad28cc313.tar.gz",
    ],
)

load("@rules_proto//proto:repositories.bzl", "rules_proto_dependencies", "rules_proto_toolchains")

rules_proto_dependencies()

rules_proto_toolchains()

###################################
# dotnet
###################################
git_repository(
    name = "io_bazel_rules_dotnet",
    commit = "da9b6c931f49e596dce1e80f7b23d54686ec9248",  # 0.0.4
    remote = "https://github.com/bazelbuild/rules_dotnet",
    shallow_since = "1572114700 +0200",
)

load(
    "@io_bazel_rules_dotnet//dotnet:defs.bzl",
    "core_register_sdk",
    "dotnet_register_toolchains",
    "dotnet_repositories",
)

dotnet_register_toolchains()

dotnet_repositories()

core_register_sdk(
    "v3.0.100",
    name = "core_sdk",
)

# grpc

git_repository(
    name = "rules_proto_grpc",
    commit = "1add33fdb7b1f2c85e660bc115c8bfe83d768162",
    remote = "https://github.com/ztl8702/rules_proto_grpc.git",
)

load("@rules_proto_grpc//:repositories.bzl", "rules_proto_grpc_toolchains")

rules_proto_grpc_toolchains()

load("@rules_proto_grpc//csharp:repositories.bzl", rules_proto_grpc_csharp_repos = "csharp_repos")

rules_proto_grpc_csharp_repos()

load("@rules_proto_grpc//csharp/nuget:packages.bzl", nuget_packages = "packages")

nuget_packages()

load("@rules_proto_grpc//csharp/nuget:nuget.bzl", "nuget_protobuf_packages","nuget_grpc_packages")

nuget_protobuf_packages()

nuget_grpc_packages()

load("//nuget:nuget.bzl", "yngdieng_nuget_packages")

yngdieng_nuget_packages()


RULES_NODEJS_VERSION = "0.34.0"
RULES_NODEJS_SHA256 = "7c4a690268be97c96f04d505224ec4cb1ae53c2c2b68be495c9bd2634296a5cd"
http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = RULES_NODEJS_SHA256,
    url = "https://github.com/bazelbuild/rules_nodejs/releases/download/%s/rules_nodejs-%s.tar.gz" % (RULES_NODEJS_VERSION, RULES_NODEJS_VERSION),
)

# Rules for compiling sass
RULES_SASS_VERSION = "86ca977cf2a8ed481859f83a286e164d07335116"
RULES_SASS_SHA256 = "4f05239080175a3f4efa8982d2b7775892d656bb47e8cf56914d5f9441fb5ea6"
http_archive(
    name = "io_bazel_rules_sass",
    sha256 = RULES_SASS_SHA256,
    url = "https://github.com/bazelbuild/rules_sass/archive/%s.zip" % RULES_SASS_VERSION,
    strip_prefix = "rules_sass-%s" % RULES_SASS_VERSION,
)

####################################
# Load and install our dependencies downloaded above.

load("@build_bazel_rules_nodejs//:defs.bzl", "check_bazel_version", "node_repositories",
    "npm_install")
check_bazel_version(
    message = """
You no longer need to install Bazel on your machine.
Your project should have a dependency on the @bazel/bazel package which supplies it.
Try running `yarn bazel` instead.
    (If you did run that, check that you've got a fresh `yarn install`)

""",
    minimum_bazel_version = "0.27.0",
)

# Setup the Node repositories. We need a NodeJS version that is more recent than v10.15.0
# because "selenium-webdriver" which is required for "ng e2e" cannot be installed.
# TODO: remove the custom repositories once "rules_nodejs" supports v10.16.0 by default.
node_repositories(
    node_repositories = {
        "10.16.0-darwin_amd64": ("node-v10.16.0-darwin-x64.tar.gz", "node-v10.16.0-darwin-x64", "6c009df1b724026d84ae9a838c5b382662e30f6c5563a0995532f2bece39fa9c"),
        "10.16.0-linux_amd64": ("node-v10.16.0-linux-x64.tar.xz", "node-v10.16.0-linux-x64", "1827f5b99084740234de0c506f4dd2202a696ed60f76059696747c34339b9d48"),
        "10.16.0-windows_amd64": ("node-v10.16.0-win-x64.zip", "node-v10.16.0-win-x64", "aa22cb357f0fb54ccbc06b19b60e37eefea5d7dd9940912675d3ed988bf9a059"),
    },
    node_version = "10.16.0",
)

npm_install(
    name = "npm",
    package_json = "//:package.json",
    package_lock_json = "//:package-lock.json",
)

load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")
install_bazel_dependencies()

load("@npm_bazel_protractor//:package.bzl", "npm_bazel_protractor_dependencies")
npm_bazel_protractor_dependencies()

load("@npm_bazel_karma//:package.bzl", "rules_karma_dependencies")
rules_karma_dependencies()

load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")
web_test_repositories()

load("@npm_bazel_karma//:browser_repositories.bzl", "browser_repositories")
browser_repositories()

load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")
ts_setup_workspace()

load("@io_bazel_rules_sass//sass:sass_repositories.bzl", "sass_repositories")
sass_repositories()
