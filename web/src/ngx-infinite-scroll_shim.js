/**
 * @fileoverview Provides named UMD shims for `ngx-infinite-scroll`.
 * This file should be included in the "scripts" of a "ts_devserver"
 * rule and the "deps" of a "ts_web_test_suite" rule.
 */
// ngx-infinite-scroll
(function (factory) {
  if (typeof module === 'object' && typeof module.exports === 'object') {
    var v = factory(
      global.ng.core,
      ((global.ng = global.ng || {}),
      (global.ng.ngxInfiniteScroll = global.ng.ngxInfiniteScroll || {})),
      global.ng.core,
      global.rxjs,
      global.rxjs_operators
    );
    if (v !== undefined) module.exports = v;
  } else if (typeof define === 'function' && define.amd) {
    define('ngx-infinite-scroll', [
      '@angular/core',
      'exports',
      '@angular/core',
      'rxjs',
      'rxjs/operators',
    ], factory);
  }
})(function (ɵngcc0, exports, _angular_core, rxjs, rxjs_operators) {
  'use strict';
  Object.keys(innerExport).forEach(function (key) {
    exports[key] = innerExport[key];
  });
  Object.defineProperty(exports, '__esModule', {value: true});
});
