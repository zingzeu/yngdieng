load("@rules_proto//proto:defs.bzl", "proto_library")
load("@npm//@bazel/labs:index.bzl", "ts_proto_library")

package(default_visibility = ["//visibility:public"])

proto_library(
    name = "explanation_proto",
    srcs = [
        "explanation.proto",
    ],
)

ts_proto_library(
    name = "explanation_ts_proto",
    proto = ":explanation_proto",
)
