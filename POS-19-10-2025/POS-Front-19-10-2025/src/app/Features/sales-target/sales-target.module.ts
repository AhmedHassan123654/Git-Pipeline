import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SalesTargetRoutingModule } from "./sales-target-routing.module";
import { SalesTargetComponent } from "./sales-target/sales-target.component";
import { SalesTargetListComponent } from "./sales-target-list/sales-target-list.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [SalesTargetComponent, SalesTargetListComponent],
  imports: [CommonModule, SalesTargetRoutingModule, SharedModule]
})
export class SalesTargetModule {}
