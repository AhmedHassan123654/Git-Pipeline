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
exports.KdsRoutingModule = void 0;
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var customer_kds_component_1 = require("./customer-kds/customer-kds.component");
var kds_component_1 = require("./kds/kds.component");
var ready_order_component_1 = require("./ready-order/ready-order.component");
var routes = [
  { path: "", component: kds_component_1.KdsComponent },
  {
    path: "readyOrder",
    component: ready_order_component_1.ReadyOrderComponent
  },
  {
    path: "customerKds",
    component: customer_kds_component_1.CustomerKdsComponent
  }
];
var KdsRoutingModule = /** @class */ (function () {
  function KdsRoutingModule() {}
  KdsRoutingModule = __decorate(
    [
      core_1.NgModule({
        imports: [router_1.RouterModule.forChild(routes)],
        exports: [router_1.RouterModule]
      })
    ],
    KdsRoutingModule
  );
  return KdsRoutingModule;
})();
exports.KdsRoutingModule = KdsRoutingModule;
