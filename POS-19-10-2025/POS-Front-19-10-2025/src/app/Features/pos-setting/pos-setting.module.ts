import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { POSSettingRoutingModule } from "./pos-setting-routing.module";
import { PosSettingsComponent } from "./pos-settings/pos-settings.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';

@NgModule({
  declarations: [PosSettingsComponent],
  imports: [CommonModule, POSSettingRoutingModule, FormsModule, ReactiveFormsModule, SharedModule,NgxQRCodeModule]
})
export class POSSettingModule {}
