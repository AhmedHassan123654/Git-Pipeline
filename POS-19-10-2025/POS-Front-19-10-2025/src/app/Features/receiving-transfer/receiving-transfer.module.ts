import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReceivingtransferComponent } from "./receivingtransfer/receivingtransfer.component";
import { ReceivingtransferRoutingModule } from "./receivingtransfer-routing.module";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { GridModule } from "@syncfusion/ej2-angular-grids";
import { ReceivingtransferlistComponent } from "./receivingtransferlist/receivingtransferlist.component";
import { SharedModule } from "src/app/shared/shared.module";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from "ngx-perfect-scrollbar";
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [ReceivingtransferComponent, ReceivingtransferlistComponent],
  imports: [
    CommonModule,
    ReceivingtransferRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    PerfectScrollbarModule,

    GridModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ReceivingTransferModule {}
