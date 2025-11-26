import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/core/Guards/auth.guard";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { PricingClassListComponent } from "./pricing-class-list/pricing-class-list.component";
import { PricingClassComponent } from "./pricing-class/pricing-class.component";
import { ProductPricingClassComponent } from "./product-pricing-class/product-pricing-class.component";

const routes: Routes = [
  {
    path: "",
    component: PricingClassComponent,
    data: ["PricingClass", "PricingClassList"]
  },
  {
    path: "PricingClassList",
    component: PricingClassListComponent,
    data: ["PricingClass", "PricingClassList"]
  },
  {
    path: "ProductPricing",
    component: ProductPricingClassComponent,
    data: ["PricingClass", "PricingClassList", "ProductPricing"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PricingClassRoutingModule {}
