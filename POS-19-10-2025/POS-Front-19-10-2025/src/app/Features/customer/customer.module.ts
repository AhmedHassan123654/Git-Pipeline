import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CustomerComponent } from "./customer/customer.component";
import { CustomerlistComponent } from "./customerlist/customerlist.component";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CustomerRoutingModule } from "./customer-routing.module";

@NgModule({
  declarations: [CustomerComponent, CustomerlistComponent],
  imports: [CommonModule, CustomerRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class CustomerModule {}
