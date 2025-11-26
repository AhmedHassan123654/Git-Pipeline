import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CategoryRoutingModule } from "./category-routing.module";
import { CategoryComponent } from "./category/category.component";
import { CategoryListComponent } from "./category-list/category-list.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [CategoryComponent, CategoryListComponent],
  imports: [CommonModule, CategoryRoutingModule, SharedModule]
})
export class CategoryModule {}
