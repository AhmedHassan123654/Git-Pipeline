import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PointofsaleComponent } from "./pointofsale/pointofsale.component";
import { PointofsalelistComponent } from "./pointofsalelist/pointofsalelist.component";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PointOfSaleRoutingModule } from "./pointofsale-routing.module";
import { ChartModule } from "@syncfusion/ej2-angular-charts";
import { CategoryService, LegendService, TooltipService } from "@syncfusion/ej2-angular-charts";
import { DataLabelService, LineSeriesService } from "@syncfusion/ej2-angular-charts";
import { DropDownListModule } from "@syncfusion/ej2-angular-dropdowns";
import { PaginationModule } from "ngx-bootstrap/pagination";
import {MatProgressBarModule} from '@angular/material/progress-bar';

@NgModule({
  declarations: [PointofsaleComponent, PointofsalelistComponent],
  imports: [
    CommonModule,
    PointOfSaleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ChartModule,
    DropDownListModule,
    PaginationModule.forRoot(),
    MatProgressBarModule
  ],
  providers: [CategoryService, LegendService, TooltipService, DataLabelService, LineSeriesService]
})
export class PointOfSaleModule {}
