import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { PosReportComponent } from "./pos-report/pos-report.component";

const routes: Routes = [
  // {
  //   path: '',
  //   component: AppLayoutComponent,
  //   canActivateChild:[AuthGuard],
  //   children: [
  { path: "", component: PosReportComponent }

  //   ]
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule {}
