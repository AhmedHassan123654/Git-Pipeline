import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { TablesComponent } from "./tables/tables.component";
import { TabsComponent } from "./tabs/tabs.component";

const routes: Routes = [
  { path: "", component: TabsComponent },
  { path: "tabs", component: TabsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DineInRoutingModule {}
