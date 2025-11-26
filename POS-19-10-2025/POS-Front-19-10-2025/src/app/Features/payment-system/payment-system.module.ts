import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PaymentSystemRoutingModule } from "./payment-system-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { PaymentSystemComponent } from "./payment-system/payment-system.component";

@NgModule({
  declarations: [PaymentSystemComponent],
  imports: [CommonModule, SharedModule, PaymentSystemRoutingModule]
})
export class PaymentSystemModule {}
