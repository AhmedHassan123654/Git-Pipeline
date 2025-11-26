import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { PrinterComponent } from "./printer/printer.component";
import { PrinterlistComponent } from "./printerlist/printerlist.component";
import { ProductPrintingComponent } from "./product-printing/product-printing.component";
const routes: Routes = [
  { path: "", component: PrinterComponent, data: ["printer", "printerlist"] },
  {
    path: "printerlist",
    component: PrinterlistComponent,
    data: ["printer", "printerlist"]
  },
  {
    path: "productPrinting",
    component: ProductPrintingComponent,
    data: ["printer", "printerlist", "productPrinting"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrinterRoutingModule {}
