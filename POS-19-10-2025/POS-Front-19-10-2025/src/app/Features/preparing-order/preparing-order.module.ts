import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PreparingOrderRoutingModule } from "./preparing-order-routing.module";
import { PrepaingOrderComponent } from "./prepaing-order/prepaing-order.component";
import { SharedModule } from "src/app/shared/shared.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";

@NgModule({
  declarations: [PrepaingOrderComponent],
  imports: [PreparingOrderRoutingModule, SharedModule,PerfectScrollbarModule]
})
export class PreparingOrderModule {}
