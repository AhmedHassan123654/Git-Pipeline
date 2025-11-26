import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { OrderTypesListComponent } from "./order-types-list/order-types-list.component";
import { OrderTypesComponent } from "./order-types/order-types.component";

const routes: Routes = [
  {
    path: "",
    component: OrderTypesComponent,
    data: ["OrderType", "orderTypeList"]
  },
  {
    path: "orderTypeList",
    component: OrderTypesListComponent,
    data: ["OrderType", "orderTypeList"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderTypesRoutingModule {}
