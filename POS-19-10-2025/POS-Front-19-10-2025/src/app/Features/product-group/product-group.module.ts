import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProductGroupRoutingModule } from "./product-group-routing.module";
import { ProductGroupComponent } from "./product-group/product-group.component";
import { SharedModule } from "src/app/shared/shared.module";
import { ProductGroupListComponent } from "./product-group-list/product-group-list.component";

@NgModule({
  declarations: [ProductGroupComponent, ProductGroupListComponent],
  imports: [CommonModule, ProductGroupRoutingModule, SharedModule]
})
export class ProductGroupModule {}
