import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CustomerPromotionRoutingModule } from "./customer-promotion-routing.module";
import { CustomerPromotionComponent } from "./customer-promotion/customer-promotion.component";
import { CustomerPromotionListComponent } from "./customer-promotion-list/customer-promotion-list.component";
import { SharedModule } from "src/app/shared/shared.module";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { PaginationModule } from "ngx-bootstrap/pagination";

@NgModule({
  declarations: [CustomerPromotionComponent, CustomerPromotionListComponent],
  imports: [CommonModule, CustomerPromotionRoutingModule, SharedModule,
    AccordionModule.forRoot(), PaginationModule.forRoot()]
})
export class CustomerPromotionModule {}
