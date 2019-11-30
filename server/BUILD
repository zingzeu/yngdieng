load("@rules_proto//proto:defs.bzl", "proto_library")
load("@rules_proto_grpc//csharp:defs.bzl", "csharp_grpc_library", "csharp_proto_library")

package(default_visibility = ["//visibility:public"])

proto_library(
    name = "documents_proto",
    srcs = [
        "documents.proto",
        "phonology.proto",
    ],
    deps = [
        "@com_google_protobuf//:timestamp_proto",
    ],
)

proto_library(
    name = "services_proto",
    srcs = [
        "services.proto",
    ],
    deps = [
        ":documents_proto",
    ],
)

csharp_grpc_library(
    name = "services_proto_csharp.dll",
    deps = [
        ":services_proto",
    ],
)

csharp_proto_library(
    name = "documents_proto_csharp.dll",
    deps = [":documents_proto"],
)

java_proto_library(
    name = "foo",
    deps = [":services_proto"],
)
