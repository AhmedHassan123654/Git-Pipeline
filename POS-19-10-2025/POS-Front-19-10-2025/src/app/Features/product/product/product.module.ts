import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProductRoutingModule } from "./product-routing.module";
import { ProductComponent } from "./product/product.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { ProductListComponent } from "./product-list/product-list.component";

@NgModule({
  declarations: [ProductComponent, ProductListComponent],
  imports: [CommonModule, ProductRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class ProductModule {}
