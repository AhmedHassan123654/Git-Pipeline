import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StatisticalReportRoutingModule } from "./statistical-report-routing.module";
import { StatisticalReportsComponent } from "./statistical-reports/statistical-reports.component";

import { ComboBoxModule } from "@syncfusion/ej2-angular-dropdowns";
import { ButtonModule } from "@syncfusion/ej2-angular-buttons";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePickerModule } from "@syncfusion/ej2-angular-calendars";
import { TimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { MultiSelectModule } from "@syncfusion/ej2-angular-dropdowns";
import { GridModule } from "@syncfusion/ej2-angular-grids";
import { PageService, SortService, FilterService, GroupService } from "@syncfusion/ej2-angular-grids";
import { TabsModule } from "ngx-bootstrap/tabs";
import { SharedModule } from "src/app/shared/shared.module";
import {
  AreaSeriesService,
  ChartAllModule,
  ChartModule,
  ExportService,
  PolarSeriesService,
  RadarSeriesService,
  ScatterSeriesService,
  SplineSeriesService,
  StackingAreaSeriesService
} from "@syncfusion/ej2-angular-charts";
import {
  CategoryService,
  DateTimeService,
  ScrollBarService,
  ColumnSeriesService,
  LineSeriesService,
  ChartAnnotationService,
  RangeColumnSeriesService,
  StackingColumnSeriesService,
  LegendService,
  TooltipService
} from "@syncfusion/ej2-angular-charts";
@NgModule({
  declarations: [StatisticalReportsComponent],
  imports: [
    CommonModule,
    StatisticalReportRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    ComboBoxModule,
    ButtonModule,
    DatePickerModule,
    TimePickerModule,
    MultiSelectModule,
    TabsModule.forRoot(),
    GridModule,
    ChartModule,
    ChartAllModule
  ],
  providers: [
    PageService,
    SortService,
    FilterService,
    GroupService,
    CategoryService,
    DateTimeService,
    ScrollBarService,
    LineSeriesService,
    ColumnSeriesService,
    ChartAnnotationService,
    RangeColumnSeriesService,
    StackingColumnSeriesService,
    LegendService,
    TooltipService,
    AreaSeriesService,
    LineSeriesService,
    ExportService,
    ColumnSeriesService,
    StackingColumnSeriesService,
    StackingAreaSeriesService,
    RangeColumnSeriesService,
    ScatterSeriesService,
    PolarSeriesService,
    CategoryService,
    RadarSeriesService,
    SplineSeriesService
  ]
})
export class StatisticalReportModule {}
