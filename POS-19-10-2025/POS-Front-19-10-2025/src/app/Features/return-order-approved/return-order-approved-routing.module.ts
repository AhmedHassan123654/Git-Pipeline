import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReturnOrderApprovedComponent } from "./return-order-approved/return-order-approved.component";

const routes: Routes = [
  {
    path: "",
    component: ReturnOrderApprovedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnOrderApprovedRoutingModule {}
