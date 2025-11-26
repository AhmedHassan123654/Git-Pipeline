import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaymentVoucherRoutingModule } from "./paymentvoucher-routing.module";
import { PaymentvoucherComponent } from "./paymentvoucher/paymentvoucher.component";
import { PaymentvoucherlistComponent } from "./paymentvoucherlist/paymentvoucherlist.component";

@NgModule({
  declarations: [PaymentvoucherComponent, PaymentvoucherlistComponent],
  imports: [CommonModule, PaymentVoucherRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class PaymentVoucherModule {}
