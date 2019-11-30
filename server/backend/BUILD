load("@io_bazel_rules_dotnet//dotnet:defs.bzl", "core_binary", "core_library")

core_binary(
    name = "backend.exe",
    srcs = [
        "Program.cs",
        "Startup.cs"
    ],
    deps = [
        "//server:services_proto_csharp.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:netstandard.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.dll",
        "@microsoft.aspnetcore.hosting//:netcoreapp2.1_core",
        "@microsoft.aspnetcore.server.kestrel.core//:netcoreapp2.1_core",
        "@microsoft.aspnetcore.hosting.abstractions//:netcoreapp2.1_core",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.console.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.private.corelib.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.runtime.dll",
    ],
)
