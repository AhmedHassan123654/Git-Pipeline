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
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
exports.__esModule = true;
exports.CustomerKdsComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var CustomerKdsComponent = /** @class */ (function () {
  function CustomerKdsComponent(document) {
    var _this = this;
    this.document = document;
    this.Fullscreen = true;
    this.bars = document.getElementsByClassName("progress-bar");
    $(document).ready(function () {
      for (var i = 0; i < _this.bars.length; i++) {
        console.log(i);
        var progressvl = $(_this.bars[i]).attr("aria-valuenow");
        $(_this.bars[i]).width(progressvl + "%");
        if (progressvl >= "90") {
          $(_this.bars[i]).addClass("bar-success");
        } else if (progressvl >= "50" && progressvl < "90") {
          $(_this.bars[i]).addClass("bar-warning");
        } else if (progressvl < "50") {
          $(_this.bars[i]).addClass("bar-error");
        }
      }
    });
    $(document).ready(function () {
      console.log("Hello World!");
    });
  }
  CustomerKdsComponent.prototype.ngOnInit = function () {
    //full screen Icon
    var IconFullScreen = document.querySelector(".FullScreen");
    IconFullScreen.addEventListener("click", function (e) {
      if (!document.fullscreenElement) {
        e.target.classList.remove("fa-expand");
        e.target.classList.add("fa-compress");
      } else {
        e.target.classList.add("fa-expand");
        e.target.classList.remove("fa-compress");
      }
    });
    //Full screen Icon end
  };
  CustomerKdsComponent.prototype.openFullscreen = function () {
    if (document.fullscreenElement) {
      this.Fullscreen = false;
      document
        .exitFullscreen()
        .then(function () {
          return console.log("Document Exited form Full screen mode");
        })
        ["catch"](function (err) {
          return console.error(err);
        });
    } else {
      document.documentElement.requestFullscreen();
      this.Fullscreen = true;
    }
  };
  CustomerKdsComponent = __decorate(
    [
      core_1.Component({
        selector: "app-customer-kds",
        templateUrl: "./customer-kds.component.html",
        styleUrls: ["./customer-kds.component.scss"]
      }),
      __param(0, core_1.Inject(common_1.DOCUMENT))
    ],
    CustomerKdsComponent
  );
  return CustomerKdsComponent;
})();
exports.CustomerKdsComponent = CustomerKdsComponent;
