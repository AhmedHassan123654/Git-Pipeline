import { NgModule } from "@angular/core";
import { ExtraExpensesTypeRoutingModule } from "./extra-expenses-type-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { CommonModule } from "@angular/common";
import { CustomerRoutingModule } from "../customer/customer-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ExtraExpensesTypeComponent } from "./extra-expenses-type/extra-expenses-type.component";
import { ExtraExpensesTypeListComponent } from "./extra-expenses-type-list/extra-expenses-type-list.component";

@NgModule({
  declarations: [ExtraExpensesTypeComponent, ExtraExpensesTypeListComponent],
  imports: [
    SharedModule,
    ExtraExpensesTypeRoutingModule,
    CommonModule,
    CustomerRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ExtraExpensesTypeModule {}
