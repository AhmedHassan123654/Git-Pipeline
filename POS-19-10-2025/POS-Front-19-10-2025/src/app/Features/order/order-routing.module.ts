import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OrderComponent } from "./order/order.component";
import { CustomerDisplayComponent } from "./customer-display/customer-display.component";

const routes: Routes = [
  // {
  // path: '',
  // component: AppLayoutComponent,
  // canActivateChild:[AuthGuard],
  // children: [
  { path: "", component: OrderComponent },
  { path: "customerdisplay", component: CustomerDisplayComponent }

  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule {}
