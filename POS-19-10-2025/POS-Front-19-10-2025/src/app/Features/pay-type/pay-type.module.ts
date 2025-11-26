import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PayTypeRoutingModule } from "./pay-type-routing.module";
import { PayTypeComponent } from "./pay-type/pay-type.component";
import { PayTypeListComponent } from "./pay-type-list/pay-type-list.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [PayTypeComponent, PayTypeListComponent],
  imports: [CommonModule, PayTypeRoutingModule, SharedModule]
})
export class PayTypeModule {}
