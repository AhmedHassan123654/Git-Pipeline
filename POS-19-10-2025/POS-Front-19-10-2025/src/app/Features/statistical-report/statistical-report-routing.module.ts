import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { StatisticalReportsComponent } from "./statistical-reports/statistical-reports.component";

const routes: Routes = [{ path: "", component: StatisticalReportsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatisticalReportRoutingModule {}
