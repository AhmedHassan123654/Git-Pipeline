import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PermissionRoutingModule } from "./permission-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { PermissionComponent } from "./permission/permission.component";
import { PermissionlistComponent } from "./permissionlist/permissionlist.component";
import { UserGroupPerMissionComponent } from "./permission/user-group-per-mission/user-group-per-mission.component";
import { SetUsersComponent } from "./permission/set-users/set-users.component";

@NgModule({
  declarations: [PermissionComponent, PermissionlistComponent, UserGroupPerMissionComponent, SetUsersComponent],
  imports: [CommonModule, PermissionRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class PermissionModule {}
