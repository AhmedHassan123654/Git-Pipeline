import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { KitchenadjutmentComponent } from "./kitchenadjutment/kitchenadjutment.component";
import { KitchenadjutmentlistComponent } from "./kitchenadjutmentlist/kitchenadjutmentlist.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from "ngx-perfect-scrollbar";
import { PopoverModule } from "ngx-smart-popover";
import { SharedModule } from "src/app/shared/shared.module";
import { KitchenAdjustmentRoutingModule } from "./kitchenadjustment-routing.module";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [KitchenadjutmentComponent, KitchenadjutmentlistComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    KitchenAdjustmentRoutingModule,
    PopoverModule,
    PerfectScrollbarModule,
    SharedModule,
    RouterModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class KitchenadjustmentModule {}
