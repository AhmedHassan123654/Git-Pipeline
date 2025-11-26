import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { ServiceChargeComponent } from "./service-charge/service-charge.component";
import { ServiceChargeListComponent } from "./service-charge-list/service-charge-list.component";

const routes: Routes = [
  {
    path: "",
    component: ServiceChargeComponent,
    data: ["serviceCharge", "serviceChargelist"]
  },

  {
    path: "serviceChargelist",
    component: ServiceChargeListComponent,
    data: ["serviceCharge", "serviceChargelist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ServiceChargeRoutingModule {}
