import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MinimumChargeRoutingModule } from "./minimum-charge-routing.module";
import { MinimumChargeComponent } from "./minimum-charge/minimum-charge.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [MinimumChargeComponent],
  imports: [
    CommonModule,
    MinimumChargeRoutingModule,
    SharedModule
    ///
  ]
})
export class MinimumChargeModule {}
