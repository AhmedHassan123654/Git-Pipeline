import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DashBoardRoutingModule } from "./dashboard-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ChartModule } from "@syncfusion/ej2-angular-charts";
import { CategoryService, ColumnSeriesService, LineSeriesService } from "@syncfusion/ej2-angular-charts";

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashBoardRoutingModule, FormsModule, ReactiveFormsModule, SharedModule, ChartModule],
  providers: [CategoryService, ColumnSeriesService, LineSeriesService]
})
export class DashBoardModule {}
