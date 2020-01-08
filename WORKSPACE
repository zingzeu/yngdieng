####################################
# ESModule imports (and TypeScript imports) can be absolute starting with the workspace name.
# The name of the workspace should match the npm package where we publish, so that these
# imports also make sense when referencing the published package.
workspace(
    name = "yngdieng",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")
load("@bazel_tools//tools/build_defs/repo:git.bzl", "git_repository")

# http_archive(
#     name = "rules_proto",
#     sha256 = "602e7161d9195e50246177e7c55b2f39950a9cf7366f74ed5f22fd45750cd208",
#     strip_prefix = "rules_proto-97d8af4dc474595af3900dd85cb3a29ad28cc313",
#     urls = [
#         "https://mirror.bazel.build/github.com/bazelbuild/rules_proto/archive/97d8af4dc474595af3900dd85cb3a29ad28cc313.tar.gz",
#         "https://github.com/bazelbuild/rules_proto/archive/97d8af4dc474595af3900dd85cb3a29ad28cc313.tar.gz",
#     ],
# )

http_archive(
    name = "rules_proto",
    sha256 = "73ebe9d15ba42401c785f9d0aeebccd73bd80bf6b8ac78f74996d31f2c0ad7a6",
    strip_prefix = "rules_proto-2c0468366367d7ed97a1f702f9cd7155ab3f73c5",
    urls = [
        "https://github.com/bazelbuild/rules_proto/archive/2c0468366367d7ed97a1f702f9cd7155ab3f73c5.tar.gz",
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

load("@rules_proto_grpc//csharp/nuget:nuget.bzl", "nuget_grpc_packages", "nuget_protobuf_packages")

nuget_protobuf_packages()

nuget_grpc_packages()

load("//nuget:nuget.bzl", "yngdieng_nuget_packages")

yngdieng_nuget_packages()

RULES_NODEJS_VERSION = "1.0.1"

RULES_NODEJS_SHA256 = "e1a0d6eb40ec89f61a13a028e7113aa3630247253bcb1406281b627e44395145"

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = RULES_NODEJS_SHA256,
    url = "https://github.com/bazelbuild/rules_nodejs/releases/download/%s/rules_nodejs-%s.tar.gz" % (RULES_NODEJS_VERSION, RULES_NODEJS_VERSION),
)

# Rules for compiling sass
RULES_SASS_VERSION = "1.24.0"

RULES_SASS_SHA256 = "77e241148f26d5dbb98f96fe0029d8f221c6cb75edbb83e781e08ac7f5322c5f"

http_archive(
    name = "io_bazel_rules_sass",
    sha256 = RULES_SASS_SHA256,
    strip_prefix = "rules_sass-%s" % RULES_SASS_VERSION,
    url = "https://github.com/bazelbuild/rules_sass/archive/%s.zip" % RULES_SASS_VERSION,
)

####################################
# Load and install our dependencies downloaded above.

load(
    "@build_bazel_rules_nodejs//:index.bzl",
    "check_bazel_version",
    "yarn_install",
)

check_bazel_version(
    message = """
You no longer need to install Bazel on your machine.
Your project should have a dependency on the @bazel/bazel package which supplies it.
Try running `yarn bazel` instead.
    (If you did run that, check that you've got a fresh `yarn install`)

""",
    minimum_bazel_version = "0.27.0",
)

# # Setup the Node repositories. We need a NodeJS version that is more recent than v10.15.0
# # because "selenium-webdriver" which is required for "ng e2e" cannot be installed.
# # TODO: remove the custom repositories once "rules_nodejs" supports v10.16.0 by default.
# node_repositories(
#     node_repositories = {
#         "10.16.0-darwin_amd64": ("node-v10.16.0-darwin-x64.tar.gz", "node-v10.16.0-darwin-x64", "6c009df1b724026d84ae9a838c5b382662e30f6c5563a0995532f2bece39fa9c"),
#         "10.16.0-linux_amd64": ("node-v10.16.0-linux-x64.tar.xz", "node-v10.16.0-linux-x64", "1827f5b99084740234de0c506f4dd2202a696ed60f76059696747c34339b9d48"),
#         "10.16.0-windows_amd64": ("node-v10.16.0-win-x64.zip", "node-v10.16.0-win-x64", "aa22cb357f0fb54ccbc06b19b60e37eefea5d7dd9940912675d3ed988bf9a059"),
#     },
#     node_version = "10.16.0",
# )

yarn_install(
    name = "npm",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

load("@npm//:install_bazel_dependencies.bzl", "install_bazel_dependencies")

install_bazel_dependencies()

load("@npm_bazel_protractor//:package.bzl", "npm_bazel_protractor_dependencies")

npm_bazel_protractor_dependencies()

load("@npm_bazel_karma//:package.bzl", "npm_bazel_karma_dependencies")

npm_bazel_karma_dependencies()

load("@npm_bazel_labs//:package.bzl", "npm_bazel_labs_dependencies")

npm_bazel_labs_dependencies()

load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")

web_test_repositories()

load("@io_bazel_rules_webtesting//web/versioned:browsers-0.3.2.bzl", "browser_repositories")

browser_repositories(
    chromium = True,
    firefox = True,
)

load("@npm_bazel_typescript//:index.bzl", "ts_setup_workspace")

ts_setup_workspace()

load("@io_bazel_rules_sass//sass:sass_repositories.bzl", "sass_repositories")

sass_repositories()

## Test grpc-typescript

# STACKB_RULES_PROTO_COMMIT = "0a888dbeacebfe06acb7ba740e0723b1adb0dd52"

# STACKB_RULES_PROTO_SHA256 = "966316838b6454ca2f51718d6a801f8ebf7d1d41c82a51ac24af4d92115fa323"

# http_archive(
#     name = "build_stack_rules_proto",
#     sha256 = STACKB_RULES_PROTO_SHA256,
#     strip_prefix = "rules_proto-%s" % STACKB_RULES_PROTO_COMMIT,
#     urls = ["https://github.com/stackb/rules_proto/archive/%s.tar.gz" % STACKB_RULES_PROTO_COMMIT],
# )

# load("@build_stack_rules_proto//github.com/grpc/grpc-web:deps.bzl", "ts_grpc_compile")

# ts_grpc_compile()

# load("@io_bazel_rules_closure//closure:defs.bzl", "closure_repositories")

# closure_repositories(
#     omit_com_google_protobuf = True,
# )

git_repository(
    name = "rules_typescript_proto",
    commit = "bb9ff5a2f7f629276a8da796bf8a77987e95ca67",  
    remote = "https://github.com/Dig-Doug/rules_typescript_proto",
    shallow_since = "1578320280 -0800"
)

load("@rules_typescript_proto//:index.bzl", "rules_typescript_proto_dependencies")

rules_typescript_proto_dependencies()