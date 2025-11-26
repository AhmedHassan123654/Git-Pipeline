import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { KitchenincomingsRoutingModule } from "./kitchenincomings-routing.module";
import { KitchenincomingComponent } from "./kitchenincoming/kitchenincoming.component";
import { KitchenincominglistComponent } from "./kitchenincominglist/kitchenincominglist.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { SearchComponentModule } from "src/app/shared/search-component/search-component/search-component.module";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [KitchenincomingComponent, KitchenincominglistComponent],
  imports: [
    CommonModule,
    KitchenincomingsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PerfectScrollbarModule,
    SearchComponentModule
  ],

  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class KitchenincomingsModule {}
