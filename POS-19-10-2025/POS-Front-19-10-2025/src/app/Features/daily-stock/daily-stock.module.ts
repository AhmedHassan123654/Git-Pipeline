import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DailyStockRoutingModule } from "./daily-stock-routing.module";
import { DailyStockComponent } from "./daily-stock/daily-stock.component";
import { DailyStockListComponent } from "./daily-stock-list/daily-stock-list.component";
import { SharedModule } from "src/app/shared/shared.module";
import { DuplicateValidatorDirective } from "src/app/validators/duplicate-validator.directive";
import { ValidateRequiredDirective } from "src/app/validators/validate-required.directive";
import { SearchComponentModule } from "../../shared/search-component/search-component/search-component.module";
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarModule,
  PerfectScrollbarConfigInterface
} from "ngx-perfect-scrollbar";
import { SearchPipe } from "./search.pipe";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

@NgModule({
  declarations: [
    DailyStockComponent,
    DailyStockListComponent,
    DuplicateValidatorDirective,
    ValidateRequiredDirective,
    SearchPipe
  ],
  imports: [CommonModule, DailyStockRoutingModule, SharedModule, SearchComponentModule, PerfectScrollbarModule],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class DailyStockModule {}
