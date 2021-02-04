load("//web/tools:ng_ts_library.bzl", ng_module = "ng_ts_library")
load("@io_bazel_rules_sass//:defs.bzl", "multi_sass_binary")

filegroup(
    name = "source",
    srcs = glob(["**/*"]),
    visibility = ["//web/src:__subpackages__"],
)

ng_module(
    name = "app",
    srcs = glob(
        ["**/*.ts"],
        exclude = [
            "**/*.spec.ts",
        ],
    ),
    angular_assets = glob([
        "**/*.css",
        "**/*.html",
    ]) + [":styles"],
    module_name = "@yngdieng-web-app",
    tsconfig = "//:tsconfig.json",
    visibility = ["//web:__subpackages__"],
    deps = [
        "//shared:documents_ts_proto",
        "//shared:services_ts_proto",
        "//web/shared/material",
        "//web/src/environments",
        "//web/src/lib",
        "//web/src/protos:settings_ts_proto",
        "//yngdieng/frontend/v3:resources_ts_proto",
        "//yngdieng/frontend/v3:service_ts_proto",
        "@npm//@angular/cdk",
        "@npm//@angular/common",
        "@npm//@angular/core",
        "@npm//@angular/forms",
        "@npm//@angular/material",
        "@npm//@angular/platform-browser",
        "@npm//@angular/router",
        "@npm//@storybook/angular",
        "@npm//@types",
        "@npm//howler",
        "@npm//rxjs",
    ],
)

multi_sass_binary(
    name = "styles",
    srcs = glob(
        ["**/*.scss"],
        exclude = [
            "styles.scss",
            "custom-theme.scss",
        ],
    ),
)
