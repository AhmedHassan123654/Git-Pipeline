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
exports.ReadyOrderComponent = void 0;
var core_1 = require("@angular/core");
var ReadyOrderComponent = /** @class */ (function () {
  function ReadyOrderComponent() {
    this.Fullscreen = true;
  }
  ReadyOrderComponent.prototype.ngOnInit = function () {
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
    // popup Start
    var editGrid = document.querySelector(".editGrid2");
    console.log(editGrid);
    editGrid.addEventListener("click", function (e) {
      if (e.target.classList.contains("popubtn")) {
        var ParentDiv = e.target.parentElement;
        ParentDiv.classList.toggle("modalContin");
        var pp = ParentDiv.parentElement;
        pp.classList.toggle("modalll");
      }
      if (e.target.classList.contains("modalll")) {
        var removePopupContainer = e.target;
        removePopupContainer.classList.remove("modalll");
        var removePopup = removePopupContainer.children[0];
        removePopup.classList.remove("modalContin");
      }
      if (e.target.classList.contains("fa-expand")) {
        e.target.classList.remove("fa-expand");
        e.target.classList.add("fa-compress");
      } else if (e.target.classList.contains("fa-compress")) {
        e.target.classList.add("fa-expand");
        e.target.classList.remove("fa-compress");
      }
    });
    //popup end
  };
  ReadyOrderComponent.prototype.openFullscreen = function () {
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
  ReadyOrderComponent = __decorate(
    [
      core_1.Component({
        selector: "app-ready-order",
        templateUrl: "./ready-order.component.html",
        styleUrls: ["./ready-order.component.scss"]
      })
    ],
    ReadyOrderComponent
  );
  return ReadyOrderComponent;
})();
exports.ReadyOrderComponent = ReadyOrderComponent;
