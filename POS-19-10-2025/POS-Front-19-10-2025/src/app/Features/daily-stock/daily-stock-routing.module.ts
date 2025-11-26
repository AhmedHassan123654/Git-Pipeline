import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DailyStock } from "src/app/core/Models/Transactions/daily-stock";
import { DailyStockListComponent } from "./daily-stock-list/daily-stock-list.component";
import { DailyStockComponent } from "./daily-stock/daily-stock.component";

const routes: Routes = [
  {
    path: "",
    component: DailyStockComponent,
    data: ["dailystock", "dailystocklist"]
  },
  {
    path: "dailystocklist",
    component: DailyStockListComponent,
    data: ["dailystock", "dailystocklist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyStockRoutingModule {}
