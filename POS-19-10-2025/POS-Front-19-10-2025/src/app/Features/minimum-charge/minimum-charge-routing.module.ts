import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MinimumChargeComponent } from "./minimum-charge/minimum-charge.component";

const routes: Routes = [
  {
    ///
    path: "",
    component: MinimumChargeComponent,
    data: ["minimumcharge"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MinimumChargeRoutingModule {}
