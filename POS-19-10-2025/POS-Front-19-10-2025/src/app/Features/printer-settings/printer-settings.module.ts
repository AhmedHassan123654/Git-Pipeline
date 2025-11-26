import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PrinterSettingsRoutingModule } from "./printer-settings-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PrinterSettingsComponent } from "./printer-settings/printer-settings.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [PrinterSettingsComponent],
  imports: [CommonModule, PrinterSettingsRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class PrinterSettingsModule {}
