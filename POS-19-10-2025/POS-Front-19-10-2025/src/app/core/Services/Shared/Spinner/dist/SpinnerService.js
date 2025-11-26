"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
exports.__esModule = true;
exports.SpinnerService = void 0;
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var SpinnerService = /** @class */ (function () {
  function SpinnerService() {
    this.count = 0;
    this.spinner$ = new rxjs_1.BehaviorSubject("");
  }
  SpinnerService.prototype.getSpinnerObserver = function () {
    return this.spinner$.asObservable();
  };
  SpinnerService.prototype.requestStarted = function () {
    this.count = 0;
    if (++this.count === 1) {
      this.spinner$.next("start");
    }
  };
  SpinnerService.prototype.requestEnded = function () {
    this.count = 0;
    if (++this.count === 0 || --this.count === 0) {
      this.spinner$.next("stop");
    }
  };
  SpinnerService.prototype.resetSpinner = function () {
    this.count = 0;
    this.spinner$.next("stop");
  };
  SpinnerService = __decorate(
    [
      core_1.Injectable({
        providedIn: "root"
      })
    ],
    SpinnerService
  );
  return SpinnerService;
})();
exports.SpinnerService = SpinnerService;
