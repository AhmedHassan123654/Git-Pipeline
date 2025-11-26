import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { OrderFollowComponent } from "./orderFollow/order-follow/order-follow.component";

const routes: Routes = [
  // {
  //   path: '',
  //   component: AppLayoutComponent,
  // canActivateChild:[AuthGuard],
  // children: [
  {
    path: "",
    component: OrderFollowComponent,
    data: ["FollowOrder"]
  }
  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderFollowRoutingModule {}
