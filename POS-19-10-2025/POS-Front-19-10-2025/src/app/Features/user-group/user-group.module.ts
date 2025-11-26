import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserGroupingRoutingModule } from "./user-group-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { UsergrouplistComponent } from "./usergrouplist/usergrouplist.component";
import { SharedModule } from "../../shared/shared.module";
import { UserGroupComponent } from "./userGroup/user-group/user-group.component";

@NgModule({
  declarations: [UserGroupComponent, UsergrouplistComponent],
  imports: [UserGroupingRoutingModule, SharedModule]
})
export class UserGroupModule {}
