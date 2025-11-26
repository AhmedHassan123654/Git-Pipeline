import { NgModule, Directive } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ItemtransferrequestComponent } from "./itemtransferrequest/itemtransferrequest.component";
import { ItemtransferrequestlistComponent } from "./itemtransferrequestlist/itemtransferrequestlist.component";
import { ItemTransferRequestRoutingModule } from "./itemtransferequest-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { SearchComponentModule } from "src/app/shared/search-component/search-component/search-component.module";
import { PopoverModule } from "ngx-smart-popover";
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarModule,
  PerfectScrollbarConfigInterface
} from "ngx-perfect-scrollbar";
import { MatPaginatorModule } from "@angular/material/paginator";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [ItemtransferrequestComponent, ItemtransferrequestlistComponent],
  imports: [
    SearchComponentModule,
    CommonModule,
    ItemTransferRequestRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    PopoverModule,
    PerfectScrollbarModule,
    SharedModule,
    MatPaginatorModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ItemTransferRequestModule {}
