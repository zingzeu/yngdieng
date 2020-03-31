load("@rules_proto//proto:defs.bzl", "proto_library")
load("@rules_proto_grpc//csharp:defs.bzl", "csharp_proto_library")

package(default_visibility = ["//visibility:public"])

proto_library(
    name = "explanation_proto",
    srcs = [
        "explanation.proto",
    ],
)

csharp_proto_library(
    name = "explanation_proto_csharp.dll",
    deps = [":explanation_proto"],
)
