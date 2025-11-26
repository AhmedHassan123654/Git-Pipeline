import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { KdsRoutingModule } from "./kds-routing.module";
import { KdsComponent } from "./kds/kds.component";
import { ReadyOrderComponent } from "./ready-order/ready-order.component";
import { CustomerKdsComponent } from "./customer-kds/customer-kds.component";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [KdsComponent, ReadyOrderComponent, CustomerKdsComponent],
  imports: [CommonModule, KdsRoutingModule, PerfectScrollbarModule, SharedModule],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class KdsModule {}
