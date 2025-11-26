import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ManageorderlistComponent } from "./manageorderlist/manageorderlist.component";
import { ManageOrderRoutingModule } from "./manageorder-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [ManageorderlistComponent],
  imports: [CommonModule, ManageOrderRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class ManageOrderModule {}
