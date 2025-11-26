import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { IntegrationListComponent } from "./integration-list/integration-list.component";
import { IntegrationSettingProductsComponent } from "./integration-setting-products/integration-setting-products.component";
import { IntegrationSettingComponent } from "./integration-setting/integration-setting.component";
import { IntegrationSettingPaymentsComponent } from "./integration-setting-payments/integration-setting-payments.component";

const routes: Routes = [
  {
    path: "",
    component: IntegrationSettingComponent,
    data: ["IntegrationSetting", "Integrationlist"]
  },
  {
    path: "Integrationlist",
    component: IntegrationListComponent,
    data: ["IntegrationSetting", "Integrationlist"]
  },
  {
    path: "IntegrationProducts",
    component: IntegrationSettingProductsComponent,
    data: ["IntegrationSetting", "Integrationlist", "IntegrationProducts"]
  },
  {
    path: "IntegrationPayments",
    component: IntegrationSettingPaymentsComponent,
    data: ["IntegrationSetting", "Integrationlist", "IntegrationPayments"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationSystemRoutingModule {}
