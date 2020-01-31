load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")

nodejs_binary(
    name = "opencc_daemon",
    data = ["@npm//opencc"],
    entry_point = ":opencc_daemon.js",
)