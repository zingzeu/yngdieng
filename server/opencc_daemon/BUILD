load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load("@io_bazel_rules_docker//nodejs:image.bzl", "nodejs_image")
load("@io_bazel_rules_docker//container:container.bzl", "container_image", "container_push")

nodejs_binary(
    name = "opencc_daemon",
    data = [
        "//thirdparty/zingzeu-data/opencc",
        "@npm//opencc",
    ],
    entry_point = ":opencc_daemon.js",
)

nodejs_image(
    name = "nodejs_image",
    binary = ":opencc_daemon",
    entry_point = "//server/opencc_daemon:opencc_daemon.js",
)

container_image(
    name = "image",
    base = ":nodejs_image",
)

container_push(
    name = "image_push",
    format = "Docker",
    image = ":image",
    registry = "docker.io",
    repository = "ztl8702/opencc-daemon",
    tag = "latest",
)
