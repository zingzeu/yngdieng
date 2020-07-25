####################################
# ESModule imports (and TypeScript imports) can be absolute starting with the workspace name.
# The name of the workspace should match the npm package where we publish, so that these
# imports also make sense when referencing the published package.
workspace(
    name = "yngdieng",
    managed_directories = {"@npm": ["node_modules"]},
)

GITHUB_COM = "github.com"
# GITHUB_COM = "github.wuyanzheshui.workers.dev"

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

http_archive(
    name = "rules_proto",
    sha256 = "4d421d51f9ecfe9bf96ab23b55c6f2b809cbaf0eea24952683e397decfbd0dd0",
    strip_prefix = "rules_proto-f6b8d89b90a7956f6782a4a3609b2f0eee3ce965",
    urls = [
        "https://" + GITHUB_COM + "/bazelbuild/rules_proto/archive/f6b8d89b90a7956f6782a4a3609b2f0eee3ce965.tar.gz",
    ],
)

load("@rules_proto//proto:repositories.bzl", "rules_proto_dependencies", "rules_proto_toolchains")

rules_proto_dependencies()

rules_proto_toolchains()

###################################
# dotnet
###################################
http_archive(
    name = "io_bazel_rules_dotnet",
    sha256 = "645aa46c80f3e8d07084ecf00f9bf8da4212cd260a0c7d6df1f1b2a48077034c",
    strip_prefix = "rules_dotnet-da9b6c931f49e596dce1e80f7b23d54686ec9248",
    urls = [
        # 0.0.4
        "https://" + GITHUB_COM + "/bazelbuild/rules_dotnet/archive/da9b6c931f49e596dce1e80f7b23d54686ec9248.tar.gz",
    ],
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

http_archive(
    name = "rules_proto_grpc",
    sha256 = "cbbcae996d8dd4832645fdf7f9ccdce0a062fb31aee14fb1c42dd335ac8aeaad",
    strip_prefix = "rules_proto_grpc-1add33fdb7b1f2c85e660bc115c8bfe83d768162",
    urls = [
        "https://" + GITHUB_COM + "/ztl8702/rules_proto_grpc/archive/1add33fdb7b1f2c85e660bc115c8bfe83d768162.tar.gz",
    ],
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

RULES_NODEJS_VERSION = "2.0.1"

RULES_NODEJS_SHA256 = "0f2de53628e848c1691e5729b515022f5a77369c76a09fbe55611e12731c90e3"

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = RULES_NODEJS_SHA256,
    url = "https://" + GITHUB_COM + "/bazelbuild/rules_nodejs/releases/download/%s/rules_nodejs-%s.tar.gz" % (RULES_NODEJS_VERSION, RULES_NODEJS_VERSION),
)

# Rules for compiling sass
RULES_SASS_VERSION = "1.25.0"

RULES_SASS_SHA256 = "c78be58f5e0a29a04686b628cf54faaee0094322ae0ac99da5a8a8afca59a647"

http_archive(
    name = "io_bazel_rules_sass",
    sha256 = RULES_SASS_SHA256,
    strip_prefix = "rules_sass-%s" % RULES_SASS_VERSION,
    url = "https://" + GITHUB_COM + "/bazelbuild/rules_sass/archive/%s.zip" % RULES_SASS_VERSION,
)

####################################
# Load and install our dependencies downloaded above.

load(
    "@build_bazel_rules_nodejs//:index.bzl",
    "check_bazel_version",
    "yarn_install",
)

check_bazel_version(
    minimum_bazel_version = "3.3.0",
)

yarn_install(
    name = "npm",
    package_json = "//:package.json",
    yarn_lock = "//:yarn.lock",
)

# Load @bazel/protractor dependencies
load("@npm//@bazel/protractor:package.bzl", "npm_bazel_protractor_dependencies")

npm_bazel_protractor_dependencies()

# Load @bazel/karma dependencies
load("@npm//@bazel/karma:package.bzl", "npm_bazel_karma_dependencies")

npm_bazel_karma_dependencies()

load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")

web_test_repositories()

# Setup the rules_webtesting toolchain

load("@io_bazel_rules_webtesting//web/versioned:browsers-0.3.2.bzl", "browser_repositories")

browser_repositories(
    chromium = True,
    firefox = True,
)

load("@io_bazel_rules_sass//sass:sass_repositories.bzl", "sass_repositories")

sass_repositories()

http_archive(
    name = "rules_typescript_proto",
    sha256 = "a7f46b105c26fa0ad4ce26430772745a22274fd05e903db973f896872a29f776",
    strip_prefix = "rules_typescript_proto-a8804e688d32b234b4cd06fe66557f256f0cd76c",
    urls = [
        "https://" + GITHUB_COM + "/ztl8702/rules_typescript_proto/archive/a8804e688d32b234b4cd06fe66557f256f0cd76c.tar.gz",
    ],
)

load("@rules_typescript_proto//:index.bzl", "rules_typescript_proto_dependencies")

rules_typescript_proto_dependencies()

###################################
# docker
###################################

RULES_DOCKER_VERSION = "0.14.4"

RULES_DOCKER_SHA256 = "4521794f0fba2e20f3bf15846ab5e01d5332e587e9ce81629c7f96c793bb7036"

http_archive(
    name = "io_bazel_rules_docker",
    sha256 = RULES_DOCKER_SHA256,
    strip_prefix = "rules_docker-%s" % RULES_DOCKER_VERSION,
    urls = ["https://%s/bazelbuild/rules_docker/releases/download/v%s/rules_docker-v%s.tar.gz" % (GITHUB_COM, RULES_DOCKER_VERSION, RULES_DOCKER_VERSION)],
)

load(
    "@io_bazel_rules_docker//repositories:repositories.bzl",
    container_repositories = "repositories",
)

container_repositories()

load(
    "@io_bazel_rules_docker//repositories:deps.bzl",
    container_deps = "deps",
)

container_deps()

load("@io_bazel_rules_docker//repositories:pip_repositories.bzl", "pip_deps")

pip_deps()

load(
    "@io_bazel_rules_docker//nodejs:image.bzl",
    _nodejs_image_repos = "repositories",
)

_nodejs_image_repos()
