load("@npm_angular_bazel//:index.bzl", "ng_module")

package(default_visibility = ["//web:__subpackages__"])

ng_module(
    name = "material",
    srcs = ["material.module.ts"],
    tsconfig = "//web/src:tsconfig.json",
    deps = [
        "@npm//@angular/core",
        "@npm//@angular/material",
    ],
)