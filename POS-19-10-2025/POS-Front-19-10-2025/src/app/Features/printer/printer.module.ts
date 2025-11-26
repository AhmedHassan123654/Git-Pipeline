import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PrinterComponent } from "./printer/printer.component";
import { PrinterlistComponent } from "./printerlist/printerlist.component";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PrinterRoutingModule } from "./printer-routing.module";
import { ProductPrintingComponent } from "./product-printing/product-printing.component";

@NgModule({
  declarations: [PrinterComponent, PrinterlistComponent, ProductPrintingComponent],
  imports: [CommonModule, PrinterRoutingModule, FormsModule, ReactiveFormsModule, SharedModule],
  providers: []
})
export class PrinterModule {}
