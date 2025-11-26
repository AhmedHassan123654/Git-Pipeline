import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StockadjutmentComponent } from "./stockadjutment/stockadjutment.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from "ngx-perfect-scrollbar";
import { PopoverModule } from "ngx-smart-popover";
import { SharedModule } from "src/app/shared/shared.module";
import { StockAdjustmentRoutingModule } from "./stockadjustment-routing.module";
import { StockadjutmentlistComponent } from "./stockadjutmentlist/stockadjutmentlist.component";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [StockadjutmentComponent, StockadjutmentlistComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StockAdjustmentRoutingModule,
    PopoverModule,
    PerfectScrollbarModule,
    SharedModule,
    RouterModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class StockadjustmentModule {}
