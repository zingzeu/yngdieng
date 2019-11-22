load("@io_bazel_rules_dotnet//dotnet:defs.bzl", "core_binary", "core_context_data")

core_binary(
    name= "test_dotnet.exe",
    srcs  = [
        "Program.cs"
    ],
    deps = [
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.console.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.private.corelib.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.runtime.dll"
    ],
)
