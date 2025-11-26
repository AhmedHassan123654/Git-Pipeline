import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SharedModule } from "src/app/shared/shared.module";
import { CashMovementFilterComponent } from "./cashmovementfilter/cash-movement-filter.component";
import { CashMovementFilterRoutingModule } from "./cashmovementfilter-routing.module";

@NgModule({
  imports: [CommonModule, SharedModule, CashMovementFilterRoutingModule],
  declarations: [CashMovementFilterComponent]
})
export class CashMovementFilterModule {}
