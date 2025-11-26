import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { InsuranceComponent } from "./insurance/insurance.component";
import { InsurancelistComponent } from "./insurancelist/insurancelist.component";

const routes: Routes = [
  {
    path: "",
    component: InsuranceComponent,
    data: ["insurance", "insurancelist"]
  },
  {
    path: "insurancelist",
    component: InsurancelistComponent,
    data: ["insurance", "insurancelist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsuranceRoutingModule {}
