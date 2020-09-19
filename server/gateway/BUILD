load("@io_bazel_rules_go//go:def.bzl", "go_binary", "go_library")

go_library(
    name = "server_lib",
    srcs = ["main.go"],
    importpath = "github.com/mindonglab/yngdieng/server/gateway",
    visibility = ["//visibility:private"],
    deps = [
        "//server/gateway/internal:go_default_library",
        "@com_github_golang_glog//:go_default_library",
    ],
)

go_binary(
    name = "gateway",
    embed = [":server_lib"],
    visibility = ["//visibility:public"],
)
