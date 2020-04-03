load("@rules_proto//proto:defs.bzl", "proto_library")

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

proto_library(
    name = "services_proto",
    srcs = [
        "services.proto",
    ],
    deps = [
        ":documents_proto",
    ],
)

java_proto_library(
    name = "foo",
    deps = [":services_proto"],
)
