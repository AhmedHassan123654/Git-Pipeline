import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { UserGroupComponent } from "./userGroup/user-group/user-group.component";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { UsergrouplistComponent } from "./usergrouplist/usergrouplist.component";

const routes: Routes = [
  {
    path: "",
    component: UserGroupComponent
  },
  {
    path: "usergrouplist",
    component: UsergrouplistComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserGroupingRoutingModule {}
