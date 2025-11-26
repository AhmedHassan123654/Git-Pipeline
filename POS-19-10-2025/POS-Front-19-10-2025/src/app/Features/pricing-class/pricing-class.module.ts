import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GridModule } from "@syncfusion/ej2-angular-grids";
import { PageService, SortService, FilterService, GroupService } from "@syncfusion/ej2-angular-grids";
import { PricingClassRoutingModule } from "./pricing-class-routing.module";
import { PricingClassComponent } from "./pricing-class/pricing-class.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { PricingClassListComponent } from "./pricing-class-list/pricing-class-list.component";
import { ProductPricingClassComponent } from "./product-pricing-class/product-pricing-class.component";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { PaginationModule } from "ngx-bootstrap/pagination";
@NgModule({
  declarations: [PricingClassComponent, PricingClassListComponent, ProductPricingClassComponent],
  imports: [
    CommonModule,
    PricingClassRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    GridModule,
    AccordionModule.forRoot(),
    PaginationModule.forRoot()
  ],
  providers: [PageService, SortService, FilterService, GroupService]
})
export class PricingClassModule {}
