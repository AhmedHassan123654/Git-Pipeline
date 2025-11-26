import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MealsAmountRoutingModule } from "./meals-amount-routing.module";
import { MeaslAmountComponent } from "./measl-amount/measl-amount.component";

import { ButtonsModule } from "ngx-bootstrap/buttons";

import { FormsModule } from "@angular/forms";

import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [MeaslAmountComponent],
  imports: [CommonModule, MealsAmountRoutingModule, PerfectScrollbarModule, FormsModule, ButtonsModule.forRoot()],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class MealsAmountModule {}
