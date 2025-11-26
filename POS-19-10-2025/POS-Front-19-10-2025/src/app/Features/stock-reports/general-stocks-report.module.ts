import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "src/app/shared/shared.module";
import { GeneralStocksReportComponent } from "./general-stocks-report/general-stocks-report.component";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { SearchComponentModule } from "src/app/shared/search-component/search-component/search-component.module";
import { TabsModule } from "ngx-bootstrap/tabs";
import { GeneralStocksReportRoutingModule } from "./general-stocks-report-routing.module";

@NgModule({
  declarations: [GeneralStocksReportComponent],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    RouterModule,
    GeneralStocksReportRoutingModule,
    TabsModule.forRoot(),
    SearchComponentModule
  ]
})
export class GeneralStocksReportModule {}
