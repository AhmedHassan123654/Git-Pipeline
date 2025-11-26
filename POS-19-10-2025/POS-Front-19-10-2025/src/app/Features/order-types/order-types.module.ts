import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OrderTypesRoutingModule } from "./order-types-routing.module";
import { OrderTypesComponent } from "./order-types/order-types.component";
import { SharedModule } from "src/app/shared/shared.module";
import { OrderTypesListComponent } from "./order-types-list/order-types-list.component";

@NgModule({
  declarations: [OrderTypesComponent, OrderTypesListComponent],
  imports: [CommonModule, OrderTypesRoutingModule, SharedModule]
})
export class OrderTypesModule {}
