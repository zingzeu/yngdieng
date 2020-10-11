####################################
# ESModule imports (and TypeScript imports) can be absolute starting with the workspace name.
# The name of the workspace should match the npm package where we publish, so that these
# imports also make sense when referencing the published package.
workspace(
    name = "yngdieng",
    managed_directories = {"@npm": ["node_modules"]},
)

load("@bazel_tools//tools/build_defs/repo:http.bzl", "http_archive")

#############
# Python
#############
# Python rules should go early in the dependencies list, otherwise a wrong
# version of the library will be selected as a transitive dependency of gRPC.

http_archive(
    name = "rules_python",
    sha256 = "d3e40ca3b7e00b72d2b1585e0b3396bcce50f0fc692e2b7c91d8b0dc471e3eaf",
    strip_prefix = "rules_python-748aa53d7701e71101dfd15d800e100f6ff8e5d1",
    url = "https://github.com/bazelbuild/rules_python/archive/748aa53d7701e71101dfd15d800e100f6ff8e5d1.zip",
)

#############
# Protobuf
#############

http_archive(
    name = "com_google_protobuf",
    sha256 = "1c744a6a1f2c901e68c5521bc275e22bdc66256eeb605c2781923365b7087e5f",
    strip_prefix = "protobuf-3.13.0",
    urls = ["https://github.com/protocolbuffers/protobuf/archive/v3.13.0.zip"],
)

http_archive(
    name = "rules_proto",
    sha256 = "602e7161d9195e50246177e7c55b2f39950a9cf7366f74ed5f22fd45750cd208",
    strip_prefix = "rules_proto-97d8af4dc474595af3900dd85cb3a29ad28cc313",
    urls = [
        "https://github.com/bazelbuild/rules_proto/archive/97d8af4dc474595af3900dd85cb3a29ad28cc313.tar.gz",
        "https://github.wuyanzheshui.workers.dev/bazelbuild/rules_proto/archive/97d8af4dc474595af3900dd85cb3a29ad28cc313.tar.gz",
    ],
)

load("@rules_proto//proto:repositories.bzl", "rules_proto_dependencies", "rules_proto_toolchains")

rules_proto_dependencies()

rules_proto_toolchains()

##############
# Go
##############
http_archive(
    name = "io_bazel_rules_go",
    sha256 = "b725e6497741d7fc2d55fcc29a276627d10e43fa5d0bb692692890ae30d98d00",
    urls = [
        "https://mirror.bazel.build/github.com/bazelbuild/rules_go/releases/download/v0.24.3/rules_go-v0.24.3.tar.gz",
        "https://github.com/bazelbuild/rules_go/releases/download/v0.24.3/rules_go-v0.24.3.tar.gz",
        "https://github.wuyanzheshui.workers.dev/bazelbuild/rules_go/releases/download/v0.24.3/rules_go-v0.24.3.tar.gz",
    ],
)

load("@io_bazel_rules_go//go:deps.bzl", "go_register_toolchains", "go_rules_dependencies")

go_rules_dependencies()

go_register_toolchains()

##############
# JavaScript
##############

RULES_NODEJS_VERSION = "2.2.0"

RULES_NODEJS_SHA256 = "4952ef879704ab4ad6729a29007e7094aef213ea79e9f2e94cbe1c9a753e63ef"

http_archive(
    name = "build_bazel_rules_nodejs",
    sha256 = RULES_NODEJS_SHA256,
    urls = [
        "https://github.com/bazelbuild/rules_nodejs/releases/download/%s/rules_nodejs-%s.tar.gz" % (RULES_NODEJS_VERSION, RULES_NODEJS_VERSION),
        "https://github.wuyanzheshui.workers.dev/bazelbuild/rules_nodejs/releases/download/%s/rules_nodejs-%s.tar.gz" % (RULES_NODEJS_VERSION, RULES_NODEJS_VERSION),
    ],
)

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

load("@npm//@bazel/labs:package.bzl", "npm_bazel_labs_dependencies")

npm_bazel_labs_dependencies()

load("@io_bazel_rules_webtesting//web:repositories.bzl", "web_test_repositories")

web_test_repositories()

# Setup the rules_webtesting toolchain

load("@io_bazel_rules_webtesting//web/versioned:browsers-0.3.2.bzl", "browser_repositories")

browser_repositories(
    chromium = True,
    firefox = True,
)

load("@com_google_protobuf//:protobuf_deps.bzl", "protobuf_deps")

protobuf_deps()

#################
# Sass
#################
RULES_SASS_VERSION = "1.25.0"

RULES_SASS_SHA256 = "c78be58f5e0a29a04686b628cf54faaee0094322ae0ac99da5a8a8afca59a647"

http_archive(
    name = "io_bazel_rules_sass",
    sha256 = RULES_SASS_SHA256,
    strip_prefix = "rules_sass-%s" % RULES_SASS_VERSION,
    urls = [
        "https://github.com/bazelbuild/rules_sass/archive/%s.zip" % RULES_SASS_VERSION,
        "https://github.wuyanzheshui.workers.dev/bazelbuild/rules_sass/archive/%s.zip" % RULES_SASS_VERSION,
    ],
)

load("@io_bazel_rules_sass//sass:sass_repositories.bzl", "sass_repositories")

sass_repositories()

###################################
# docker
###################################

RULES_DOCKER_VERSION = "0.14.4"

RULES_DOCKER_SHA256 = "4521794f0fba2e20f3bf15846ab5e01d5332e587e9ce81629c7f96c793bb7036"

http_archive(
    name = "io_bazel_rules_docker",
    sha256 = RULES_DOCKER_SHA256,
    strip_prefix = "rules_docker-%s" % RULES_DOCKER_VERSION,
    urls = [
        "https://github.com/bazelbuild/rules_docker/releases/download/v%s/rules_docker-v%s.tar.gz" % (RULES_DOCKER_VERSION, RULES_DOCKER_VERSION),
        "https://github.wuyanzheshui.workers.dev/bazelbuild/rules_docker/releases/download/v%s/rules_docker-v%s.tar.gz" % (RULES_DOCKER_VERSION, RULES_DOCKER_VERSION),
    ],
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

load(
    "@io_bazel_rules_docker//go:image.bzl",
    _go_image_repos = "repositories",
)

_go_image_repos()

##################
# grpc-gateway
##################

http_archive(
    name = "com_github_grpc_ecosystem_grpc_gateway",
    sha256 = "f03e3554d1547f7b57009beab88922612abf2d8fc7c2db9fece998cb625c530e",
    strip_prefix = "grpc-gateway-1.15.2",
    urls = [
        "https://github.wuyanzheshui.workers.dev/grpc-ecosystem/grpc-gateway/archive/v1.15.2.tar.gz",
        "https://github.com/grpc-ecosystem/grpc-gateway/archive/v1.15.2.tar.gz",
    ],
)

load("@com_github_grpc_ecosystem_grpc_gateway//:repositories.bzl", grpc_gateway_go_repositories = "go_repositories")

grpc_gateway_go_repositories()
