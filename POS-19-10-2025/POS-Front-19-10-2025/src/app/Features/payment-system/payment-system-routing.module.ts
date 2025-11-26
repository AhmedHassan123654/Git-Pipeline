import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PaymentSystemComponent } from "./payment-system/payment-system.component";

const routes: Routes = [
  { path: "", component: PaymentSystemComponent, data: ["PaymentSystem"] }
  // { path: 'OrderInsurancelist', component: OrderInsurancelistComponent,data :["OrderInsurance","OrderInsurancelist"]  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentSystemRoutingModule {}
