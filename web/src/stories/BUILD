load("@npm//@bazel/typescript:index.bzl", "ts_devserver", "ts_library")

filegroup(
    name = "stories",
    srcs = glob(
        ["**/*"],
        exclude = ["**/*.ts"],
    ) + [":ts_stories"],
    visibility = ["//web/src:__subpackages__"],
)

ts_library(
    name = "ts_stories",
    srcs = glob(["**/*.ts"]),
    deps = [
        "@npm//@angular/cdk",
        "@npm//@angular/common",
        "@npm//@angular/core",
        "@npm//@angular/forms",
        "@npm//@angular/material",
        "@npm//@angular/platform-browser",
        "@npm//@angular/router",
        "@npm//@storybook/angular",
    ],
)
