import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { EmployeesRoutingModule } from "src/app/Features/employees/employees-routing.module";
import { EmployeesComponent } from "src/app/Features/employees/employees/employees.component";
import { EmployeeListComponent } from "src/app/Features/employees/employee-list/employee-list.component";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { EmployeeListComponent } from "./employee-list/employee-list.component";

@NgModule({
  declarations: [EmployeesComponent, EmployeeListComponent],
  imports: [CommonModule, EmployeesRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class EmployeesModule {}
