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
exports.KdsComponent = void 0;
var core_1 = require("@angular/core");
var core_2 = require("@angular/core");
var KdsComponent = /** @class */ (function () {
  function KdsComponent(cdr, orderser, toastr, toastrMessage) {
    this.cdr = cdr;
    this.orderser = orderser;
    this.toastr = toastr;
    this.toastrMessage = toastrMessage;
    this.masonryItems = [
      {
        title: "item 1",
        orders: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
        weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
      },
      {
        title: "item 2",
        orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        weekdays: ["sun", "mon", "sun", "mon", "tue", "wed"]
      },
      {
        title: "item 3",
        orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        weekdays: ["sun", "mon", "tue", "wed"]
      },
      {
        title: "item 4",
        orders: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
        weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
      },
      {
        title: "item 5",
        orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "mon", "tue", "wed"]
      },
      {
        title: "item 6",
        orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        weekdays: ["sun", "mon", "tue", "wed"]
      },
      {
        title: "item 7",
        orders: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
        weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
      },
      {
        title: "item 8",
        orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "mon", "tue", "wed"]
      },
      {
        title: "item 9",
        orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        weekdays: ["sun", "mon", "tue", "wed"]
      },
      {
        title: "item 10",
        orders: [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13],
        weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"]
      },
      {
        title: "item 11",
        orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        weekdays: ["sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun", "mon", "tue", "wed"]
      },
      {
        title: "item 12",
        orders: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16],
        weekdays: ["sun", "mon", "tue", "wed"]
      }
    ];
    this.Fullscreen = true;
  }
  KdsComponent.prototype.ngAfterContentChecked = function () {
    this.cdr.detectChanges();
  };
  KdsComponent.prototype.getCardHeight = function () {
    var arr = [];
    for (var _i = 0, _a = this.childs.toArray(); _i < _a.length; _i++) {
      var child = _a[_i];
      arr.push(child.nativeElement.clientHeight);
    }
    ///3
    var Heighest3 = arr
      .sort(function (a, b) {
        return a - b;
      })
      .slice(-4);
    var xHeight =
      Heighest3 && Heighest3.length > 0
        ? Heighest3.reduce(function (a, b) {
            return a + b;
          })
        : 0;
    if (!xHeight) this.vv = "100%;";
    else this.vv = xHeight + "px";
    // console.log(this.vv);
    ///4
    // let Heighest4 = arr
    // .sort( ( a:any, b:any )=> { return a - b; })
    // .slice( -5 );
    // let xHeight4 = Heighest4.reduce( ( a:any, b:any )=> { return a + b;});
    // this.vv = xHeight4+'px';
    this.cdr.detectChanges();
  };
  KdsComponent.prototype.ngAfterViewInit = function () {
    this.getCardHeight();
  };
  KdsComponent.prototype.ngOnDestroy = function () {
    if (this.interval) {
      clearInterval(this.interval);
    }
  };
  KdsComponent.prototype.ngOnInit = function () {
    var _this = this;
    this.getAllOpenOrders();
    // this.interval = setInterval(() => {
    //   this.getAllOpenOrders();
    // }, 5000);
    this.perfectScroll = false;
    var getHeight = document.querySelectorAll(".ms-card");
    var heightGet = getHeight.forEach(function (e) {
      return e.clientHeight;
    });
    console.log("hh" + heightGet);
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
    //popup Start
    var editGrid = document.querySelector(".editGrid");
    //console.log(editGrid)
    editGrid.addEventListener("click", function (e) {
      _this.perfectScroll = false;
      if (e.target.classList.contains("popubtn")) {
        var ParentDiv = e.target.parentElement;
        ParentDiv.classList.toggle("modalContin");
        var pp = ParentDiv.parentElement;
        pp.classList.toggle("modalll");
        var height = pp.offsetHeight;
        console.log(height);
      }
      if (e.target.classList.contains("modalll")) {
        _this.perfectScroll = true;
        var replaceIcon = e.target.querySelector("i.fa");
        replaceIcon.classList.remove("fa-compress");
        replaceIcon.classList.add("fa-expand");
        console.log(replaceIcon);
        // this.perfectScroll = false;
        var removePopupContainer = e.target;
        if (removePopupContainer.classList.contains("modalll")) {
          removePopupContainer.classList.remove("modalll");
          _this.perfectScroll = false;
        }
        var removePopup = removePopupContainer.children[0];
        removePopup.classList.remove("modalContin");
        //  (e.target as HTMLTextAreaElement).classList.add('fa-expand');
        //  (e.target as HTMLTextAreaElement).classList.remove('fa-compress');
      } else {
        _this.perfectScroll = false;
      }
      if (e.target.classList.contains("fa-expand")) {
        _this.perfectScroll = true;
        e.target.classList.remove("fa-expand");
        e.target.classList.add("fa-compress");
      } else if (e.target.classList.contains("fa-compress")) {
        _this.perfectScroll = false;
        e.target.classList.add("fa-expand");
        e.target.classList.remove("fa-compress");
      }
    });
    //  editGrid.addEventListener('click',e=>{
    //   if((e.target as HTMLTextAreaElement).classList.contains('ms-card')){
    //     console.log('db'+e.target)
    //   }
    // })
    //popup end
  };
  KdsComponent.prototype.groupBy = function (list, keyGetter) {
    var map = new Map();
    list.forEach(function (item) {
      var key = item[keyGetter];
      var collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  };
  KdsComponent.prototype.getAllOpenOrders = function () {
    var _this = this;
    this.orderser.GetAllOpenOrders([]).subscribe(function (res) {
      _this.allDetails = [];
      _this.allSideDishes = [];
      _this.sumaryList = [];
      _this.orders = res;
      _this.ordersCount = _this.orders
        .map(function (item) {
          return item.OrderNumber;
        })
        .filter(function (value, index, self) {
          return self.indexOf(value) === index;
        });
      _this.orders.forEach(function (x) {
        x.CreationTime = new Date(x.CreationTime);
        x.ModificationTime = new Date(x.ModificationTime);
        // get remaining Time For KOT
        var ProductsPeriodTime = x.OrderDetails.map(function (od) {
          var _a;
          return (_a = od.Product) === null || _a === void 0 ? void 0 : _a.ProductPeriodTime;
        });
        x.MaxProductPeriodTime = Math.max.apply(null, ProductsPeriodTime);
        if (x.MaxProductPeriodTime && x.MaxProductPeriodTime > 0) {
          if (new Date().getHours() == x.ModificationTime.getHours()) {
            var nowMinutes = new Date().getMinutes() - x.ModificationTime.getMinutes();
            x.RemainingTime = x.MaxProductPeriodTime - nowMinutes;
          } else if (new Date().getHours() > x.ModificationTime.getHours()) {
            var plusHouers = new Date().getHours() - x.ModificationTime.getHours();
            var nowMinutes = new Date().getMinutes() + plusHouers * 60 - x.ModificationTime.getMinutes();
            x.RemainingTime = x.MaxProductPeriodTime - nowMinutes;
          }
        }
        var details = x.OrderDetails.filter(function (x) {
          return !x.ProductDone;
        });
        if (details && details.length > 0) _this.allDetails.push.apply(_this.allDetails, details);
        details.forEach(function (d) {
          if (d.OrderDetailSubItems && d.OrderDetailSubItems.length > 0)
            _this.allSideDishes.push.apply(_this.allSideDishes, d.OrderDetailSubItems);
        });
      });
      _this.sumaryList = [];
      _this.allDetails.forEach(function (d) {
        var _a;
        _this.sumaryList.push({
          Name: (_a = d.Product) === null || _a === void 0 ? void 0 : _a.Name,
          Qty: d.ProductQuantity
        });
      });
      _this.allSideDishes.forEach(function (s) {
        _this.sumaryList.push({ Name: s.ProductSubItemName, Qty: s.Quantity });
      });
      var ProductGroupedByName = _this.groupBy(_this.sumaryList, "Name");
      _this.finalSummarylist = [];
      ProductGroupedByName.forEach(function (c) {
        var _a;
        var sumNumber = c
          .map(function (mm) {
            return mm.Qty;
          })
          .reduce(function (first, curr) {
            return first + curr;
          }, 0);
        _this.finalSummarylist.push({
          Name: (_a = c[0]) === null || _a === void 0 ? void 0 : _a.Name,
          Qty: c
            .map(function (mm) {
              return mm.Qty;
            })
            .reduce(function (first, curr) {
              return first + curr;
            }, 0)
        });
      });
      _this.orders.sort(function (a, b) {
        return b.ModificationTime - a.ModificationTime;
      });
      _this.getCardHeight();
    });
  };
  KdsComponent.prototype.setOrderDone = function (order) {
    var _this = this;
    this.orderser.SetOrderDone(order).subscribe(function (res) {
      if (res == 1) {
        _this.getAllOpenOrders();
        _this.toastr.info(_this.toastrMessage.GlobalMessages(res), "KDS");
      } else _this.toastr.info(_this.toastrMessage.GlobalMessages(res), "KDS");
    });
  };
  KdsComponent.prototype.openFullscreen = function () {
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
  __decorate([core_1.ViewChildren("childRef")], KdsComponent.prototype, "childs");
  KdsComponent = __decorate(
    [
      core_2.Component({
        selector: "app-kds",
        templateUrl: "./kds.component.html",
        styleUrls: ["./kds.component.scss"]
      })
    ],
    KdsComponent
  );
  return KdsComponent;
})();
exports.KdsComponent = KdsComponent;
