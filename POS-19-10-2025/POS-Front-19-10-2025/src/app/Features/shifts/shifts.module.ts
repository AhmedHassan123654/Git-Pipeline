import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ShiftsRoutingModule } from "./shifts-routing.module";
import { ShiftsComponent } from "./shifts/shifts.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ShiftlistComponent } from "./shiftlist/shiftlist.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [ShiftsComponent, ShiftlistComponent],
  imports: [CommonModule, ShiftsRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class ShiftsModule {}
