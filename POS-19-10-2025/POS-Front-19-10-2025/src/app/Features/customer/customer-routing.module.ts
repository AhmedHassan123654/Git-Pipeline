import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { CustomerComponent } from "./customer/customer.component";
import { CustomerlistComponent } from "./customerlist/customerlist.component";
const routes: Routes = [
  {
    path: "",
    component: CustomerComponent,
    data: ["customer", "customerlist"]
  },
  {
    path: "customerlist",
    component: CustomerlistComponent,
    data: ["customer", "customerlist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule {}
