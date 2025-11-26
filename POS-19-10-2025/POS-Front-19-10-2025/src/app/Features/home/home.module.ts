import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeComponent } from "./home/home.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { HomeRoutingModule } from "./home-routing.module";
import { PopoverModule } from "ngx-smart-popover";
import { WatchComponent } from "../dash-board/dashboard/Watch/Watch.component";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import {
  PieSeriesService,
  AccumulationLegendService,
  AccumulationTooltipService,
  AccumulationAnnotationService,
  AccumulationDataLabelService
} from "@syncfusion/ej2-angular-charts";
import { ChartModule } from "@syncfusion/ej2-angular-charts";
import {
  DateTimeService,
  CategoryService,
  LineSeriesService,
  ColumnSeriesService
} from "@syncfusion/ej2-angular-charts";
import { LegendService, DataLabelService } from "@syncfusion/ej2-angular-charts";
import { AccumulationChartModule } from "@syncfusion/ej2-angular-charts";
import { MatDialogModule } from "@angular/material/dialog";
import { MatMenuModule } from "@angular/material/menu";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: true
};

@NgModule({
  declarations: [HomeComponent, WatchComponent],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PopoverModule,
    PerfectScrollbarModule,
    ChartModule,
    AccumulationChartModule,
    MatDialogModule,
    MatMenuModule
  ],
  // providers: []
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    PieSeriesService,
    AccumulationLegendService,
    AccumulationTooltipService,
    AccumulationDataLabelService,
    DateTimeService,
    LineSeriesService,
    LegendService,
    DataLabelService,
    ColumnSeriesService,
    CategoryService,
    AccumulationAnnotationService
  ]
})
export class HomeModule {}
