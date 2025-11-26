import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EndofdayComponent } from "./endofday/endofday.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { EndOfDayRoutingModule } from "./endofday-routing.module";
import { StimulsoftViewerModule } from "stimulsoft-viewer-angular";
import { TabsModule } from "ngx-bootstrap/tabs";
import { AccumulationChartModule } from "@syncfusion/ej2-angular-charts";
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
import { SpinnerComponent } from "src/app/shared/Directives/Spinner/Spinner.component";

@NgModule({
  declarations: [EndofdayComponent],
  imports: [
    CommonModule,
    EndOfDayRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    TabsModule.forRoot(),
    AccumulationChartModule,
    ChartModule
  ],
  providers: [
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
export class EndOfDayModule {}
