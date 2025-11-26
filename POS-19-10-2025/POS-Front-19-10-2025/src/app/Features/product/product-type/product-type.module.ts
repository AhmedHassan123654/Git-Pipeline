import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ProductTypeRoutingModule } from "./product-type-routing.module";
import { ProductTypeComponent } from "./product-type/product-type.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { ProductTypeListComponent } from "./product-type-list/product-type-list.component";

@NgModule({
  declarations: [ProductTypeComponent, ProductTypeListComponent],
  imports: [CommonModule, ProductTypeRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class ProductTypeModule {}
