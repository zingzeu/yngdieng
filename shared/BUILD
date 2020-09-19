load("@io_bazel_rules_go//proto:def.bzl", "go_proto_library")
load("@rules_proto//proto:defs.bzl", "proto_library")
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
go_proto_library(
   name = "documents_go_proto",
   importpath = "github.com/mindonglab/yngdieng/shared/documents",
   proto=":documents_proto",
deps = [
 "//shared/zingzeudata:explanation_go_proto"]
 
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

ts_proto_library(
    name = "services_ts_proto",
    proto = ":services_proto",
)

proto_library(
    name = "tt",
    srcs = ["echo.proto"],
    deps = [
        "@go_googleapis//google/api:annotations_proto",
    ],
)

go_proto_library(
    name = "services_go_proto",
    compilers = [
        "@io_bazel_rules_go//proto:go_grpc",
        "@com_github_grpc_ecosystem_grpc_gateway//protoc-gen-grpc-gateway:go_gen_grpc_gateway",
    ],
    importpath = "github.com/mindonglab/yngdieng/shared/services",
    proto = ":services_proto",
    deps = [
  "@go_googleapis//google/api:annotations_go_proto",
     ":documents_go_proto"]
)
