import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BiometricComponent } from "./biometric/biometric.component";
import { BiometricRoutingModule } from "./biometric-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [BiometricComponent],
  imports: [CommonModule, BiometricRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class BiometricModule {}
