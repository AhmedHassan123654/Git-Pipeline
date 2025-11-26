import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PopoverModule } from "ngx-smart-popover";
import { SharedModule } from "src/app/shared/shared.module";
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarModule,
  PerfectScrollbarConfigInterface
} from "ngx-perfect-scrollbar";
import { InventoryComponent } from "./stockinventory/inventory.component";
import { RouterModule } from "@angular/router";
import { InventoryRoutingModule } from "./inventory-routing.module";
import { InventorylistComponent } from "./stockinventorylist/inventorylist.component";
import { SearchComponentModule } from "src/app/shared/search-component/search-component/search-component.module";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [InventoryComponent, InventorylistComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InventoryRoutingModule,
    // KitchenInventoryRoutingModule,
    PopoverModule,
    PerfectScrollbarModule,
    SharedModule,
    RouterModule,
    SearchComponentModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class InventoryModule {}
