import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomerKdsComponent } from "./customer-kds/customer-kds.component";

import { KdsComponent } from "./kds/kds.component";
import { ReadyOrderComponent } from "./ready-order/ready-order.component";

const routes: Routes = [
  { path: "", component: KdsComponent },
  { path: "readyOrder", component: ReadyOrderComponent },
  { path: "customerKds", component: CustomerKdsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KdsRoutingModule {}
