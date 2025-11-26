import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrderInsuranceComponent } from "./order-insurance/order-insurance.component";
import { OrderInsurancelistComponent } from "./order-insurancelist/order-insurancelist.component";

const routes: Routes = [
  {
    path: "",
    component: OrderInsuranceComponent,
    data: ["OrderInsurance", "OrderInsurancelist"]
  },
  {
    path: "OrderInsurancelist",
    component: OrderInsurancelistComponent,
    data: ["OrderInsurance", "OrderInsurancelist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderInsuranceRoutingModule {}
