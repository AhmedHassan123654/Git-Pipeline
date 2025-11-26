import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CallCenterOrdersListComponent } from "./call-center-orders-list/call-center-orders-list.component";

const routes: Routes = [{ path: "", component: CallCenterOrdersListComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FollowCallCenterOrderRoutingModule {}
