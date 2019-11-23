load("@io_bazel_rules_dotnet//dotnet:defs.bzl", "core_binary", "core_library")

core_library(
    name = "hanzi_utils.dll",
    srcs = ["HanziUtils.cs"],
    deps = [
        "//server:services_proto_csharp.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.console.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.private.corelib.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.runtime.dll",
    ]
)

core_library(
    name = "foochow_romanized_utils.dll",
    srcs = ["FoochowRomanizedUtils.cs"],
    deps = [
        "//server:services_proto_csharp.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.console.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.private.corelib.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.runtime.dll",
    ]
)

core_binary(
    name = "indexer.exe",
    srcs = [
        "Program.cs",
        "CreateCikLinDocumentsAction.cs",
        "CreateDFDDocumentsAction.cs",
    ],
    deps = [
        ":hanzi_utils.dll",
        ":foochow_romanized_utils.dll",
        "//server:services_proto_csharp.dll",
        "@csvhelper//:netcoreapp2.0_core",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.console.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.private.corelib.dll",
        "@io_bazel_rules_dotnet//dotnet/stdlib.core:system.runtime.dll",
    ],
)
