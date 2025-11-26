import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { StockComponent } from "./stock/stock.component";
import { StocklistComponent } from "./stocklist/stocklist.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { StockRoutingModule } from "./stock-routing.module";

@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SharedModule, StockRoutingModule],
  declarations: [StockComponent, StocklistComponent]
})
export class StockModuleModule {}
