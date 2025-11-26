import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomerGroupListComponent } from "./customer-group-list/customer-group-list.component";
import { CustomerGroupComponent } from "./customer-group/customer-group.component";

const routes: Routes = [
  {
    path: "",
    component: CustomerGroupComponent,
    data: ["customerGroup", "customerGrouplist"]
  },
  {
    path: "customerGrouplist",
    component: CustomerGroupListComponent,
    data: ["customerGroup", "customerGrouplist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerGroupRoutingModule {}
