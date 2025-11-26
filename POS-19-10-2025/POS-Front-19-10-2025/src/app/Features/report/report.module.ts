import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportRoutingModule } from "./report-routing.module";
// import { PosReportComponent } from "./pos-report/pos-report.component";
import { ComboBoxModule } from "@syncfusion/ej2-angular-dropdowns";
import { ButtonModule } from "@syncfusion/ej2-angular-buttons";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DatePickerModule } from "@syncfusion/ej2-angular-calendars";
import { TimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { MultiSelectModule } from "@syncfusion/ej2-angular-dropdowns";
import { GridModule } from "@syncfusion/ej2-angular-grids";
import { PageService, SortService, FilterService, GroupService } from "@syncfusion/ej2-angular-grids";
import { SharedModule } from "src/app/shared/shared.module";
import { TabsModule } from "ngx-bootstrap/tabs";

@NgModule({
  declarations: [
    // PosReportComponent
  ],
  imports: [
    CommonModule,
    ReportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ComboBoxModule,
    ButtonModule,
    DatePickerModule,
    TimePickerModule,
    MultiSelectModule,
    TabsModule.forRoot(),
    GridModule,
    SharedModule
  ],
  providers: [PageService, SortService, FilterService, GroupService]
})
export class ReportModule {}
