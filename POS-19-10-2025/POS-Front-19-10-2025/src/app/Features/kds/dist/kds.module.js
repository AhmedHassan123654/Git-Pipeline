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
exports.KdsModule = void 0;
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var kds_routing_module_1 = require("./kds-routing.module");
var kds_component_1 = require("./kds/kds.component");
var ready_order_component_1 = require("./ready-order/ready-order.component");
var customer_kds_component_1 = require("./customer-kds/customer-kds.component");
var ngx_masonry_1 = require("ngx-masonry");
var ngx_perfect_scrollbar_1 = require("ngx-perfect-scrollbar");
var ngx_perfect_scrollbar_2 = require("ngx-perfect-scrollbar");
var DEFAULT_PERFECT_SCROLLBAR_CONFIG = {
  suppressScrollX: true
};
var KdsModule = /** @class */ (function () {
  function KdsModule() {}
  KdsModule = __decorate(
    [
      core_1.NgModule({
        declarations: [
          kds_component_1.KdsComponent,
          ready_order_component_1.ReadyOrderComponent,
          customer_kds_component_1.CustomerKdsComponent
        ],
        imports: [
          common_1.CommonModule,
          kds_routing_module_1.KdsRoutingModule,
          ngx_masonry_1.NgxMasonryModule,
          ngx_perfect_scrollbar_1.PerfectScrollbarModule
        ],
        providers: [
          {
            provide: ngx_perfect_scrollbar_2.PERFECT_SCROLLBAR_CONFIG,
            useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
          }
        ]
      })
    ],
    KdsModule
  );
  return KdsModule;
})();
exports.KdsModule = KdsModule;
