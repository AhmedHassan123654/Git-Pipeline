import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OrderFollowRoutingModule } from "./order-follow-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { OrderFollowComponent } from "./orderFollow/order-follow/order-follow.component";
import { DatePickerModule } from "@syncfusion/ej2-angular-calendars";
import { ComboBoxModule } from "@syncfusion/ej2-angular-dropdowns";
import { ButtonModule } from "@syncfusion/ej2-angular-buttons";
@NgModule({
  declarations: [OrderFollowComponent],
  imports: [
    CommonModule,
    OrderFollowRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    DatePickerModule,
    ComboBoxModule,
    ButtonModule
  ]
})
export class OrderFollowModule {}
