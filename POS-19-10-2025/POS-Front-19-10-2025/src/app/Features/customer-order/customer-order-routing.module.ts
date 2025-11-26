import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomerOrderComponent } from "./customer-order/customer-order.component";
import { CustomerOrderListComponent } from "./customer-order-list/customer-order-list.component";

const routes: Routes = [
  {
    path: "",
    component: CustomerOrderComponent,
    data: ["CustomerOrders", "CustomerOrderlist"]
  },
  {
    path: "CustomerOrderlist",
    component: CustomerOrderListComponent,
    data: ["CustomerOrders", "CustomerOrderlist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerOrderRoutingModule {}
