import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DailyInventoryComponent } from "./daily-inventory/daily-inventory.component";
import { DailyInventoryListComponent } from "./daily-inventory-list/daily-inventory-list.component";

const routes: Routes = [
  {
    path: "",
    component: DailyInventoryComponent,
    data: ["dailyinventory", "dailyinventorylist"]
  },
  {
    path: "dailyinventorylist",

    component: DailyInventoryListComponent,
    data: ["dailyinventory", "dailyinventorylist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyInventoryRoutingModule {}
