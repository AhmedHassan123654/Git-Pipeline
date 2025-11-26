import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReturnInsuranceListComponent } from "./return-insurance-list/return-insurance-list.component";
import { ReturnInsuranceComponent } from "./return-insurance/return-insurance.component";

const routes: Routes = [
  {
    path: "",
    component: ReturnInsuranceComponent,
    data: ["returnInsurances", "ReturnInsuranceList"]
  },
  {
    path: "ReturnInsuranceList",
    component: ReturnInsuranceListComponent,
    data: ["returnInsurances", "ReturnInsuranceList"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnInsurancesRoutingModule {}
