load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load("@io_bazel_rules_docker//nodejs:image.bzl", "nodejs_image")

nodejs_binary(
    name = "opencc_daemon",
    data = [
        "//thirdparty/zingzeu-data/opencc",
        "@npm//opencc",
    ],
    entry_point = ":opencc_daemon.js",
)

nodejs_image(
    name = "image",
    # npm deps will be put into their own layer
    data = [
        ":opencc_daemon",
        "@npm//opencc",
    ],
    entry_point = "//server/opencc_daemon:opencc_daemon.js",
)
