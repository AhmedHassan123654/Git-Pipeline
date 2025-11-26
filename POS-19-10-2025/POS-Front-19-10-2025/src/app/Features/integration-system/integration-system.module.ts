import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { IntegrationSystemRoutingModule } from "./integration-system-routing.module";
import { IntegrationSettingComponent } from "./integration-setting/integration-setting.component";
import { IntegrationListComponent } from "./integration-list/integration-list.component";
import { IntegrationSettingProductsComponent } from "./integration-setting-products/integration-setting-products.component";
import { SharedModule } from "src/app/shared/shared.module";
import { IntegrationSettingPaymentsComponent } from "./integration-setting-payments/integration-setting-payments.component";

@NgModule({
  declarations: [
    IntegrationSettingComponent,
    IntegrationListComponent,
    IntegrationSettingProductsComponent,
    IntegrationSettingPaymentsComponent
  ],
  imports: [CommonModule, IntegrationSystemRoutingModule, SharedModule]
})
export class IntegrationSystemModule {}
