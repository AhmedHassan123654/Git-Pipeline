import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { InsuranceRoutingModule } from "./insurance-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { InsuranceComponent } from "./insurance/insurance.component";
import { InsurancelistComponent } from "./insurancelist/insurancelist.component";

@NgModule({
  declarations: [InsuranceComponent, InsurancelistComponent],
  imports: [CommonModule, InsuranceRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class InsuranceModule {}
