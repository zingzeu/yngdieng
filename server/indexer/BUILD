load("@io_bazel_rules_dotnet//dotnet:defs.bzl", "core_binary")

core_binary(
    name = "indexer.exe",
    srcs = [
        "Program.cs",
        "CreateCikLinDocumentsAction.cs"
    ],
    deps = [
        "//server:services_proto_csharp.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.console.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.private.corelib.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.runtime.dll",
    ],
)
