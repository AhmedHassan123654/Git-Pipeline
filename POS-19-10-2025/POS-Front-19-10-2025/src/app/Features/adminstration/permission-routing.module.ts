import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { PermissionComponent } from "./permission/permission.component";
import { SetUsersComponent } from "./permission/set-users/set-users.component";
import { UserGroupPerMissionComponent } from "./permission/user-group-per-mission/user-group-per-mission.component";
import { PermissionlistComponent } from "./permissionlist/permissionlist.component";

const routes: Routes = [
  {
    path: "",
    component: UserGroupPerMissionComponent,
    data: ["PermissionGroup", "PermissionGroupList"]
  },
  {
    path: "PermissionGroupList",
    component: PermissionlistComponent,
    data: ["PermissionGroup", "PermissionGroupList"]
  },
  {
    path: "SetPermissionGroup",
    component: PermissionComponent,
    data: ["PermissionGroup", "PermissionGroupList", "SetPermissionGroup"]
  },
  {
    path: "SetUsers",
    component: SetUsersComponent,
    data: ["PermissionGroup", "PermissionGroupList", "SetUsers"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PermissionRoutingModule {}
