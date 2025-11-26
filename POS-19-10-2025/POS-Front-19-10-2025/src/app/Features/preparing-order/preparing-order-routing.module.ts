import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PrepaingOrderComponent } from "./prepaing-order/prepaing-order.component";

const routes: Routes = [{ path: "", component: PrepaingOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PreparingOrderRoutingModule {}
