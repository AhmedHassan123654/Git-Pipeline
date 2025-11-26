import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TaxesRoutingModule } from "./taxes-routing.module";
import { TaxComponent } from "./tax/tax.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { TaxListComponent } from "./tax-list/tax-list.component";
import { AssignTaxProductsComponent } from "./assign-tax-products/assign-tax-products.component";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { PaginationModule } from "ngx-bootstrap/pagination";

@NgModule({
  declarations: [TaxComponent, TaxListComponent, AssignTaxProductsComponent],
  imports: [
    CommonModule,
    TaxesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PaginationModule.forRoot(),
    AccordionModule.forRoot()
  ]
})
export class TaxesModule {}
