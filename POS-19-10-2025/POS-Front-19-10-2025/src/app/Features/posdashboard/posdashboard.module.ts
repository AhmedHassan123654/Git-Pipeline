import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { POSDashboardRoutingModule } from "./posdashboard-routing.module";
import { POSDashBoardComponent } from "./posdash-board/posdash-board.component";
import { SharedModule } from "src/app/shared/shared.module";
import {
  BarSeriesService,
  CategoryService,
  ChartModule,
  ColumnSeriesService,
  DataLabelService,
  LegendService,
  LineSeriesService,
  MultiLevelLabelService,
  SelectionService
} from "@syncfusion/ej2-angular-charts";
import { DropDownListModule } from "@syncfusion/ej2-angular-dropdowns";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { BrowserModule } from "@angular/platform-browser";

@NgModule({
  declarations: [POSDashBoardComponent],
  imports: [
    CommonModule,
    POSDashboardRoutingModule,
    SharedModule,
    ChartModule,
    DropDownListModule,
    PaginationModule.forRoot()
  ],
  providers: [
    CategoryService,
    BarSeriesService,
    ColumnSeriesService,
    LineSeriesService,
    LegendService,
    DataLabelService,
    MultiLevelLabelService,
    SelectionService
  ]
})
export class POSDashboardModule {}
