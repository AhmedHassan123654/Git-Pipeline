import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CustomerGroupRoutingModule } from "./customer-group-routing.module";
import { CustomerGroupComponent } from "./customer-group/customer-group.component";
import { CustomerGroupListComponent } from "./customer-group-list/customer-group-list.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [CustomerGroupComponent, CustomerGroupListComponent],
  imports: [CommonModule, CustomerGroupRoutingModule, SharedModule]
})
export class CustomerGroupModule {}
