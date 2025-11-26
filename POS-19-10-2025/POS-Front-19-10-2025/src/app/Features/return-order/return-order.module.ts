import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReturnorderComponent } from "./returnorder/returnorder.component";
import { ReturnorderlistComponent } from "./returnorderlist/returnorderlist.component";
import { ReturnOrderRoutingModule } from "./returnorder-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EditorderComponent } from "./editorder/editorder.component";
import { CustomDatePipe } from "src/app/shared/Directives/customDatePipe";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [ReturnorderComponent, ReturnorderlistComponent, EditorderComponent, CustomDatePipe],
  exports: [CustomDatePipe],
  imports: [
    CommonModule,
    ReturnOrderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule
  ]
})
export class ReturnOrderModule {}
