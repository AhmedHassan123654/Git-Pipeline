import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FollowCallCenterOrderRoutingModule } from "./follow-call-center-order-routing.module";
import { CallCenterOrdersListComponent } from "./call-center-orders-list/call-center-orders-list.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [CallCenterOrdersListComponent],
  imports: [CommonModule, FollowCallCenterOrderRoutingModule, SharedModule]
})
export class FollowCallCenterOrderModule {}
