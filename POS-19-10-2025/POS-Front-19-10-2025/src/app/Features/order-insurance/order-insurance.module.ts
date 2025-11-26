import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { OrderInsuranceRoutingModule } from "./order-insurance-routing.module";
import { OrderInsuranceComponent } from "./order-insurance/order-insurance.component";
import { OrderInsurancelistComponent } from "./order-insurancelist/order-insurancelist.component";

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [OrderInsuranceComponent, OrderInsurancelistComponent],
  imports: [CommonModule, SharedModule, PerfectScrollbarModule, OrderInsuranceRoutingModule],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class OrderInsuranceModule {}
