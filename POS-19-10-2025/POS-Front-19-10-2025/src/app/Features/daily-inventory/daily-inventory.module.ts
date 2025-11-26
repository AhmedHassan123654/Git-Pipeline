import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DailyInventoryRoutingModule } from "./daily-inventory-routing.module";
import { DailyInventoryListComponent } from "./daily-inventory-list/daily-inventory-list.component";
import { SharedModule } from "src/app/shared/shared.module";
// import { DuplicateValidatorDirective } from "src/app/validators/duplicate-validator.directive";
// import { ValidateRequiredDirective } from "src/app/validators/validate-required.directive";
import { SearchComponentModule } from "../../shared/search-component/search-component/search-component.module";
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarModule,
  PerfectScrollbarConfigInterface
} from "ngx-perfect-scrollbar";
import { DailyInventoryComponent } from "./daily-inventory/daily-inventory.component";
import { FormsModule } from "@angular/forms";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    DailyInventoryComponent,
    DailyInventoryListComponent,
    // DuplicateValidatorDirective,
    // ValidateRequiredDirective
  ],
  imports: [CommonModule, DailyInventoryRoutingModule, SharedModule, SearchComponentModule, PerfectScrollbarModule],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class DailyInventoryModule {}
