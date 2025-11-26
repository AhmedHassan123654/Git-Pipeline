import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ExtraExpensesTypeListComponent } from "./extra-expenses-type-list/extra-expenses-type-list.component";
import { ExtraExpensesTypeComponent } from "./extra-expenses-type/extra-expenses-type.component";

const routes: Routes = [
  {
    path: "",
    component: ExtraExpensesTypeComponent,
    data: ["ExtraExpensesType", "ExtraExpenseTypelist"]
  },
  {
    path: "ExtraExpenseTypelist",
    component: ExtraExpensesTypeListComponent,
    data: ["ExtraExpensesType", "ExtraExpenseTypelist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraExpensesTypeRoutingModule {}
