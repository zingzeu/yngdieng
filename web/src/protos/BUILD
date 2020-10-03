load("@rules_proto//proto:defs.bzl", "proto_library")
load("@npm//@bazel/labs:index.bzl", "ts_proto_library")

proto_library(
    name = "settings_proto",
    srcs = ["settings.proto"],
    deps = ["//shared:services_proto"],
)

ts_proto_library(
    name = "settings_ts_proto",
    proto = ":settings_proto",
    visibility = ["//web:__subpackages__"],
)
