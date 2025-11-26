import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomerPromotionListComponent } from "./customer-promotion-list/customer-promotion-list.component";
import { CustomerPromotionComponent } from "./customer-promotion/customer-promotion.component";

const routes: Routes = [
  {
    path: "",
    component: CustomerPromotionComponent,
    data: ["CustomerPromotion", "customerPromotionlist"]
  },
  {
    path: "customerPromotionlist",
    component: CustomerPromotionListComponent,
    data: ["CustomerPromotion", "customerPromotionlist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerPromotionRoutingModule {}
