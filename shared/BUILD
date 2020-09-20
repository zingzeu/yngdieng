load("@rules_proto//proto:defs.bzl", "proto_library")
load(
    "@gapic_generator_typescript//rules_typescript_gapic:typescript_gapic.bzl",
    "typescript_gapic_library",
)
load("@npm//@bazel/labs:index.bzl", "ts_proto_library")

package(default_visibility = ["//visibility:public"])

proto_library(
    name = "documents_proto",
    srcs = [
        "documents.proto",
        "phonology.proto",
    ],
    deps = [
        "//shared/zingzeudata:explanation_proto",
    ],
)

ts_proto_library(
    name = "documents_ts_proto",
    proto = ":documents_proto",
)

proto_library(
    name = "services_proto",
    srcs = [
        "services.proto",
    ],
    deps = [
        ":documents_proto",
        "@go_googleapis//google/api:annotations_proto",
    ],
)

proto_library(
    name = "tt",
    srcs = ["echo.proto"],
    deps = [
        "@go_googleapis//google/api:annotations_proto",
    ],
)

typescript_gapic_library(
    name = "services_gapic_library",
    src = ":services_proto",
    deps = [],
)
