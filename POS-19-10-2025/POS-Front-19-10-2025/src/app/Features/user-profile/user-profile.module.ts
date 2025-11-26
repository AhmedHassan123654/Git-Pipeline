import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { UserProfileRoutingModule } from "./userprofile-routing.module";
import { SharedModule } from "../../shared/shared.module";
import { FormsModule } from "@angular/forms";
import { MustMatchDirectiveProfilePass } from "src/app/shared/Directives/must-match-directive-profilepass";
import { MustMatchDirectivePin } from "src/app/shared/Directives/must-match-directive-pin";

@NgModule({
  declarations: [UserProfileComponent],
  imports: [CommonModule, UserProfileRoutingModule, SharedModule, FormsModule]
})
export class UserProfileModule {}
