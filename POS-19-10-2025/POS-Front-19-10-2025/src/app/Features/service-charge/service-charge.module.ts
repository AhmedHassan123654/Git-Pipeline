import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ServiceChargeRoutingModule } from "./service-charge-routing.module";
import { ServiceChargeComponent } from "./service-charge/service-charge.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { ServiceChargeListComponent } from "./service-charge-list/service-charge-list.component";

@NgModule({
  declarations: [ServiceChargeComponent, ServiceChargeListComponent],
  imports: [CommonModule, ServiceChargeRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class ServiceChargeModule {}
