import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReturninsuranceComponent } from "./returninsurance/returninsurance.component";
import { ReturninsurancelistComponent } from "./returninsurancelist/returninsurancelist.component";
import { ReturnInsuranceRoutingModule } from "./returninsurance-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
@NgModule({
  declarations: [ReturninsuranceComponent, ReturninsurancelistComponent],
  imports: [CommonModule, ReturnInsuranceRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class ReturnInsuranceModule {}
