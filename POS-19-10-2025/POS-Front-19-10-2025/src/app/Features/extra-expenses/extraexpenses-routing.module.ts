import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { ExtraexpensesComponent } from "./extraexpenses/extraexpenses.component";
import { ExtraexpenseslistComponent } from "./extraexpenseslist/extraexpenseslist.component";

const routes: Routes = [
  {
    path: "",
    component: ExtraexpensesComponent,
    data: ["extraexpenses", "extraexpenseslist"]
  },
  {
    path: "extraexpenseslist",
    component: ExtraexpenseslistComponent,
    data: ["extraexpenses", "extraexpenseslist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExtraExpensesRoutingModule {}
