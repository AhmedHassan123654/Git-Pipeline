import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EndShiftRoutingModule } from "./end-shift-routing.module";
import { EndShiftComponent } from "./end-shift/end-shift.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
@NgModule({
  declarations: [EndShiftComponent],
  imports: [CommonModule, EndShiftRoutingModule, SharedModule]
})
export class EndShiftModule {}
