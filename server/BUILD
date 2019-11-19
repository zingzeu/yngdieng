load("@rules_proto//proto:defs.bzl", "proto_library")

proto_library(
    name = "documents_proto",
    srcs = [
        "documents.proto",
        "phonology.proto"
    ]
)

proto_library(
    name="services_proto",
    srcs = [
        "services.proto"
    ],
    deps = [
        ":documents_proto"
    ]
)