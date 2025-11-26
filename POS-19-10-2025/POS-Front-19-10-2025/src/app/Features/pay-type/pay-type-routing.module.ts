import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { PayTypeListComponent } from "./pay-type-list/pay-type-list.component";
import { PayTypeComponent } from "./pay-type/pay-type.component";

const routes: Routes = [
  { path: "", component: PayTypeComponent, data: ["PayType", "paytypeList"] },
  {
    path: "paytypeList",
    component: PayTypeListComponent,
    data: ["PayType", "paytypeList"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PayTypeRoutingModule {}
