import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChartModule, CategoryService, ColumnSeriesService, LineSeriesService, LegendService, DataLabelService, MultiLevelLabelService, SelectionService } from "@syncfusion/ej2-angular-charts";

import { SharedModule } from "src/app/shared/shared.module";
import { NewDashboardRoutingModule } from "./new-dashboard-routing.module";
import { NewDashboardComponent } from "./new-dashboard/new-dashboard.component";

@NgModule({
  declarations: [NewDashboardComponent],
  imports: [CommonModule, NewDashboardRoutingModule, SharedModule, FormsModule],
  providers: [],
})
export class NewDashboardModule {}
