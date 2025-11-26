import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CustomerOrderRoutingModule } from "./customer-order-routing.module";
import { CustomerOrderComponent } from "./customer-order/customer-order.component";
import { SharedModule } from "src/app/shared/shared.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { CustomerOrderListComponent } from "./customer-order-list/customer-order-list.component";
import { CustomerOrderReservationComponent } from "./customer-order-reservation/customer-order-reservation.component";
import { MatDialogModule } from "@angular/material/dialog";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [CustomerOrderComponent, CustomerOrderListComponent, CustomerOrderReservationComponent],
  imports: [CommonModule, SharedModule, PerfectScrollbarModule, CustomerOrderRoutingModule ,MatDialogModule],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class CustomerOrderModule {}
