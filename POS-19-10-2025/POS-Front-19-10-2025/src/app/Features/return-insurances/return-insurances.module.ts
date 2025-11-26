import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ReturnInsurancesRoutingModule } from "./return-insurances-routing.module";
import { ReturnInsuranceComponent } from "./return-insurance/return-insurance.component";
import { ReturnInsuranceListComponent } from "./return-insurance-list/return-insurance-list.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [ReturnInsuranceComponent, ReturnInsuranceListComponent],
  imports: [CommonModule, ReturnInsurancesRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class ReturnInsurancesModule {}
