import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ProductsQuantitiesMonitoringComponent } from "./product-quantity-monitoring/products-quantities-monitoring.component";
import { FormsModule } from "@angular/forms";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import {
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule,
  PERFECT_SCROLLBAR_CONFIG
} from "ngx-perfect-scrollbar";
import { ProductsQuantitiesMonitoringRoutingModule } from "./product-quantites-monitoring-routing.module";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
@NgModule({
  declarations: [ProductsQuantitiesMonitoringComponent],
  imports: [
    CommonModule,
    ProductsQuantitiesMonitoringRoutingModule,
    PerfectScrollbarModule,
    FormsModule,
    ButtonsModule.forRoot()
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class ProductQuantitesMonitoringModule {}
