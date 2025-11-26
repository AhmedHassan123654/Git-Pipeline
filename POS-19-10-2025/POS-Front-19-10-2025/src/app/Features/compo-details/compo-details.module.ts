import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CompoDetailsRoutingModule } from "./compo-details-routing.module";
import { CompoDetailsComponent } from "./compo-details/compo-details.component";

import { SharedModule } from "src/app/shared/shared.module";

import { DatePickerModule } from "@syncfusion/ej2-angular-calendars";
import { ComboBoxModule } from "@syncfusion/ej2-angular-dropdowns";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from "ngx-perfect-scrollbar";
import { CompoDetailListComponent } from "./compo-detail-list/compo-detail-list.component";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [CompoDetailsComponent, CompoDetailListComponent],
  imports: [
    CommonModule,
    CompoDetailsRoutingModule,
    SharedModule,
    DatePickerModule,
    PerfectScrollbarModule,
    ComboBoxModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class CompoDetailsModule {}
