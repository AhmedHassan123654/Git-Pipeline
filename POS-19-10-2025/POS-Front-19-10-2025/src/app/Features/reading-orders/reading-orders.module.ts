import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReadingOrdersRoutingModule } from "./reading-orders-routing.module";
import { ReadingOrderComponent } from "./reading-order/reading-order.component";

@NgModule({
  declarations: [ReadingOrderComponent],
  imports: [CommonModule, ReadingOrdersRoutingModule]
})
export class ReadingOrdersModule {}
