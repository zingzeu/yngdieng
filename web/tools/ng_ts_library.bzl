"ng_ts_library"

load("@npm//@bazel/typescript:index.bzl", "ts_library")

def ng_ts_library(**kwargs):
    """a drop-in replacement for ng_module
    """
    ts_library(
        compiler = "//web/tools:tsc_wrapped_with_angular",
        supports_workers = True,
        use_angular_plugin = True,
        **kwargs
    )