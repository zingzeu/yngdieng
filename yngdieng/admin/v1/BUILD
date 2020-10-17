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
    proto = ":resources_ts_proto",
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
