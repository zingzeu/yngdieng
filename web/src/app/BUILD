load("@npm_angular_bazel//:index.bzl", "ng_module")
load("@io_bazel_rules_sass//:defs.bzl", "multi_sass_binary")

ng_module(
    name = "app",
    srcs = glob(
        ["**/*.ts"],
        exclude = [
            "**/*.spec.ts",
        ],
    ),
    assets = glob([
        "**/*.css",
        "**/*.html",
    ]) + [":styles"],
    tsconfig = "//web/src:tsconfig.json",
    visibility = ["//web:__subpackages__"],
    deps = [
        "//web/src/environments",
        "//web/src/material",
        "//web/src/yngdieng:lib",
        "//web/src/yngdieng:services_grpc_ts",
        "@npm//@angular/core",
        "@npm//@angular/material",
        "@npm//@angular/platform-browser",
        "@npm//@angular/router",
        "@npm//@types",
        "@npm//rxjs",
       # "@npm//ngx-infinite-scroll",
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
