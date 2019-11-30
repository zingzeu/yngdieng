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
