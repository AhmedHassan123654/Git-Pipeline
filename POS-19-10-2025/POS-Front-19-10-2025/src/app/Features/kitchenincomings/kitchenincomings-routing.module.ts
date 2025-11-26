import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { KitchenincomingComponent } from "./kitchenincoming/kitchenincoming.component";
import { KitchenincominglistComponent } from "./kitchenincominglist/kitchenincominglist.component";

const routes: Routes = [
  {
    path: "",
    component: KitchenincomingComponent,
    data: ["incoming", "incominglist"]
  },
  {
    path: "incominglist",
    component: KitchenincominglistComponent,
    data: ["incoming", "incominglist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class KitchenincomingsRoutingModule {}
