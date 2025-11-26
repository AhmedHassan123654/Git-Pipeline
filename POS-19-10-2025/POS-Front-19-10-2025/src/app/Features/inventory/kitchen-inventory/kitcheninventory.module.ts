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
import { KitchenInventoryComponent } from "./kitchenstockinventory/kitcheninventory.component";
import { RouterModule } from "@angular/router";
import { KitchenInventoryRoutingModule } from "./kitcheninventory-routing.module";
import { KitchenInventorylistComponent } from "./kitchenstockinventorylist/kitcheninventorylist.component";
import { SearchComponentModule } from "src/app/shared/search-component/search-component/search-component.module";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [KitchenInventoryComponent, KitchenInventorylistComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KitchenInventoryRoutingModule,
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
export class KitchenInventoryModule {}
