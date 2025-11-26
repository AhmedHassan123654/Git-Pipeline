import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { ReturninsuranceComponent } from "./returninsurance/returninsurance.component";
import { ReturninsurancelistComponent } from "./returninsurancelist/returninsurancelist.component";

const routes: Routes = [
  // {
  //   path: '',
  //   component: AppLayoutComponent,
  //   canActivateChild:[AuthGuard],
  //   children: [
  { path: "", component: ReturninsurancelistComponent },
  { path: "returninsurance", component: ReturninsuranceComponent }

  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnInsuranceRoutingModule {}
