import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";

import { GeneralStocksReportComponent } from "./general-stocks-report/general-stocks-report.component";
const routes: Routes = [{ path: "", component: GeneralStocksReportComponent, data: ["stocksreports"] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GeneralStocksReportRoutingModule {}
