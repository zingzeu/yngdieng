load("@npm_bazel_typescript//:index.bzl", "ts_library")

ts_library(
    name = "environments",
    srcs = glob([
        "*.ts",
    ]),
    visibility = ["//web:__subpackages__"],
    deps = [
        "@npm//@angular/core"
    ]
)