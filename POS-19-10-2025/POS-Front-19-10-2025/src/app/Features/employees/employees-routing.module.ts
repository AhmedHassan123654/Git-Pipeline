import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { EmployeesComponent } from "src/app/Features/employees/employees/employees.component";
import { EmployeeListComponent } from "src/app/Features/employees/employee-list/employee-list.component";
const routes: Routes = [
  // {
  //   path: '',
  //   component: AppLayoutComponent,
  //   canActivateChild:[AuthGuard],
  //   children: [
  {
    path: "",
    component: EmployeesComponent,
    data: ["employees", "EmployeeList"]
  },
  {
    path: "EmployeeList",
    component: EmployeeListComponent,
    data: ["employees", "EmployeeList"]
  }

  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeesRoutingModule {}
