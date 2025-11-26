import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { StopProductsRoutingModule } from "./stop-products-routing.module";
import { StopProductsComponent } from "./stop-products/stop-products.component";
import { SharedModule } from "src/app/shared/shared.module";
import { ComboBoxModule } from "@syncfusion/ej2-angular-dropdowns";
@NgModule({
  declarations: [StopProductsComponent],
  imports: [CommonModule, StopProductsRoutingModule, ComboBoxModule, SharedModule]
})
export class StopProductsModule {}
