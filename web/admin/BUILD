load("@build_bazel_rules_nodejs//:index.bzl", "pkg_web")
load("@npm//@babel/cli:index.bzl", "babel")
load("//web/tools:ng_ts_library.bzl", ng_module = "ng_ts_library")
load("@npm//@bazel/rollup:index.bzl", "rollup_bundle")
load("@npm//history-server:index.bzl", "history_server")
load("@npm//@bazel/typescript:index.bzl", "ts_devserver", "ts_library")
load("@io_bazel_rules_sass//:defs.bzl", "sass_binary", "sass_library")
load("@npm//html-insert-assets:index.bzl", "html_insert_assets")
load("@npm//@bazel/terser:index.bzl", "terser_minified")
load("@build_bazel_rules_nodejs//internal/npm_install:npm_umd_bundle.bzl", "npm_umd_bundle")

package(default_visibility = ["//visibility:public"])

sass_binary(
    name = "global_stylesheet",
    src = "styles.scss",
    include_paths = ["external/npm/node_modules"],
    output_name = "global_stylesheet.css",
    deps = [
        ":custom_theme",
    ],
)

sass_library(
    name = "custom_theme",
    srcs = [
        "custom-theme.scss",
        "@npm//:node_modules/@angular/material/_theming.scss",
    ],
)

ng_module(
    name = "src",
    srcs = [
        "main.dev.ts",
        "main.prod.ts",
    ],
    tsconfig = "//web/src:tsconfig.json",
    deps = [
        "//web/admin/app",
        "@npm//@angular/core",
        "@npm//@angular/platform-browser",
    ],
)

# Files that we serve in both development and production
_ASSETS = [
    # This label references an output of the "styles" sass_binary above.
    ":global_stylesheet.css",

    # We load zone.js outside the bundle. That's because it's a "pollyfill"
    # which speculates that such features might be available in a browser.
    # Also it's tricky to configure dead code elimination to understand that
    # zone.js is used, given that we don't have any import statement that
    # imports from it.
    "@npm//:node_modules/zone.js/bundles/zone.umd.min.js",
]

html_insert_assets(
    name = "inject_scripts_for_dev",
    outs = ["index.html"],
    args = [
        "--html=$(execpath //web/admin:static/index.html)",
        "--out=$@",
        "--roots=. $(RULEDIR)",
        "--assets",
    ] + ["$(execpath %s)" % s for s in _ASSETS] + [
        # This file doesn't exist during the build, but will be served by ts_devserver
        "_/ts_scripts.js",
    ],
    data = ["//web/admin:static/index.html"] + _ASSETS,
)

html_insert_assets(
    name = "inject_scripts_for_prod",
    # We cannot output "index.html" since that collides with devmode file.
    # pkg_web rule will re-root paths with _{name} by default.
    outs = ["_prodapp/web/admin/index.html"],
    args = [
        "--html=$(execpath //web/admin:static/index.prod.html)",
        "--out=$@",
        "--roots=. $(RULEDIR)",
        "--assets",
    ] + ["$(execpath %s)" % s for s in _ASSETS],
    data = ["//web/admin:static/index.prod.html"] + _ASSETS,
)

rollup_bundle(
    name = "bundle-es2015",
    config_file = "rollup.config.js",
    entry_points = {
        ":main.prod.ts": "index",
    },
    output_dir = True,
    deps = [
        ":src",
        "@npm//:node_modules",
        "@npm//@rollup/plugin-commonjs",
        "@npm//@rollup/plugin-node-resolve",
    ],
)

babel(
    name = "bundle-es5",
    args = [
        "$(execpath :bundle-es2015)",
        "--no-babelrc",
        "--source-maps",
        "--presets=@babel/preset-env",
        "--out-dir",
        "$(@D)",
    ],
    data = [
        ":bundle-es2015",
        "@npm//@babel/preset-env",
    ],
    output_dir = True,
)

terser_minified(
    name = "bundle-es2015.min",
    src = ":bundle-es2015",
)

terser_minified(
    name = "bundle-es5.min",
    src = ":bundle-es5",
)

pkg_web(
    name = "prodapp",
    srcs = _ASSETS + [
        ":bundle-es2015.min",
        ":bundle-es5.min",
        ":inject_scripts_for_prod",
        "robots.txt",
        "//web/admin/assets",
        # ":global_stylesheet",
        # Include polyfills that will be requested by old browsers
        "@npm//:node_modules/systemjs/dist/system.js",
        "@npm//:node_modules/core-js/client/core.min.js",
    ],
    # In production mode we serve some polyfills with script tags that have hard-coded paths in the index.html
    # so we must serve them at that path, by stripping a prefix
    additional_root_paths = [
        "npm/node_modules/core-js/client",
        "npm/node_modules/systemjs/dist",
    ],
    substitutions = {"0.0.0-PLACEHOLDER": "{STABLE_GIT_COMMIT_SHORT}"},
)

history_server(
    name = "prodserver",
    data = [":prodapp"],
    # '-a src/prodapp' will ask history-server to scan for all apps under the
    # given folder this will result in the following auto-configuration:
    #   /example => src/prodapp/example
    #   /        => src/prodapp
    templated_args = [
        "-a",
        "web/admin/prodapp",
    ],
)

# The auto-generated @npm//@auth0/auth0-angular:auth0-angular__umd doesn't compile.
npm_umd_bundle(
    name = "auth0-angular__umd",
    package_name = "@auth0/auth0-angular",
    entry_point = "@npm//:node_modules/@auth0/auth0-angular/fesm2015/auth0-auth0-angular.js",
    excluded = ["@angular/router"],
    package = "@npm//@auth0/auth0-angular:auth0-angular",
)

ts_devserver(
    name = "devserver",
    # serve web/admin/index.html at /index.html
    additional_root_paths = ["web/admin"],
    entry_module = "yngdieng/web/admin/main.dev",
    # These scripts will be included in the JS bundle after require.js
    # They should have only named UMD modules, or require.js will throw.
    scripts = [
        "@npm//@bazel/labs/grpc_web:bootstrap_scripts",
        "@npm//:node_modules/tslib/tslib.js",
        "//web/shared:rxjs_umd_modules",
        "@npm//howler:howler__umd",
        ":auth0-angular__umd",
    ],
    static_files = _ASSETS + [
        ":inject_scripts_for_dev",
        "//web/admin/assets",
    ],
    deps = [":src"],
)
