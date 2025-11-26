import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AssigndriverComponent } from "./assigndriver/assigndriver.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AssignDriverRoutingModule } from "./assigndriver-routing.module";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [AssigndriverComponent],
  imports: [CommonModule, AssignDriverRoutingModule, FormsModule, ReactiveFormsModule, SharedModule],
  providers: []
})
export class AssigndriverModule {}
