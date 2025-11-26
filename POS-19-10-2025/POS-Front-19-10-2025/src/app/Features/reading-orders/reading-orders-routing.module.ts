import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReadingOrderComponent } from "./reading-order/reading-order.component";

const routes: Routes = [{ path: "", component: ReadingOrderComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReadingOrdersRoutingModule {}
