import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReturnOrderApprovedRoutingModule } from "./return-order-approved-routing.module";
import { ReturnOrderApprovedComponent } from "./return-order-approved/return-order-approved.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";

import { DatePickerModule } from "@syncfusion/ej2-angular-calendars";
import { ComboBoxModule } from "@syncfusion/ej2-angular-dropdowns";
import { ButtonModule } from "@syncfusion/ej2-angular-buttons";
@NgModule({
  declarations: [ReturnOrderApprovedComponent],
  imports: [
    CommonModule,
    ReturnOrderApprovedRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DatePickerModule,
    ComboBoxModule,
    ButtonModule
  ]
})
export class ReturnOrderApprovedModule {}
