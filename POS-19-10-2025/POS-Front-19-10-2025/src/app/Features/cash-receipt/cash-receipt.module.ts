import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CashreceiptComponent } from "./cashreceipt/cashreceipt.component";
import { CashreceiptlistComponent } from "./cashreceiptlist/cashreceiptlist.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { CashReceiptRoutingModule } from "./cashreceipt-routing.module";

@NgModule({
  declarations: [CashreceiptComponent, CashreceiptlistComponent],
  imports: [CashReceiptRoutingModule, SharedModule]
})
export class CashReceiptModule {}
