load("@io_bazel_rules_go//go:def.bzl", "go_library")

go_library(
    name = "go_default_library",
    srcs = [
        "gateway.go",
        "handlers.go",
        "main.go",
    ],
    importpath = "github.com/mindonglab/yngdieng/server/gateway/internal",
    visibility = ["//visibility:public"],
    deps = [
        "//shared:services_go_proto",
        "//yngdieng/frontend/v3:service_go_proto",
        "@com_github_golang_glog//:go_default_library",
        "@com_github_grpc_ecosystem_grpc_gateway//runtime:go_default_library",
        "@org_golang_google_grpc//:go_default_library",
        "@org_golang_google_grpc//connectivity:go_default_library",
    ],
)
