load("@io_bazel_rules_go//proto:def.bzl", "go_proto_library")
load("@rules_proto//proto:defs.bzl", "proto_library")
load("@npm//@bazel/labs:index.bzl", "ts_proto_library")

package(default_visibility = ["//visibility:public"])

proto_library(
    name = "resources_proto",
    srcs = [
        "resources.proto",
    ],
)

ts_proto_library(
    name = "resources_ts_proto",
    proto = ":resources_proto",
)

go_proto_library(
    name = "resources_go_proto",
    importpath = "github.com/mindonglab/yngdieng/yngdieng/frontend/v1/resources",
    proto = ":resources_proto",
)

proto_library(
    name = "service_proto",
    srcs = [
        "service.proto",
    ],
    deps = [
        ":resources_proto",
        "@com_google_protobuf//:empty_proto",
        "@com_google_protobuf//:field_mask_proto",
        "@go_googleapis//google/api:annotations_proto",
    ],
)

ts_proto_library(
    name = "service_ts_proto",
    proto = ":service_proto",
)

go_proto_library(
    name = "service_go_proto",
    compilers = [
        "@io_bazel_rules_go//proto:go_grpc",
        "@com_github_grpc_ecosystem_grpc_gateway//protoc-gen-grpc-gateway:go_gen_grpc_gateway",
    ],
    importpath = "github.com/mindonglab/yngdieng/yngdieng/frontend/v1/service",
    proto = ":service_proto",
    deps = [
        ":resources_go_proto",
        "@go_googleapis//google/api:annotations_go_proto",
    ],
)
