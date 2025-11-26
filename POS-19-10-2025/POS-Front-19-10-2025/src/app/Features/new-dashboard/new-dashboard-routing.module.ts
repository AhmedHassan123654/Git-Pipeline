import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NewDashboardComponent } from "./new-dashboard/new-dashboard.component";

const routes: Routes = [{ path: "", component: NewDashboardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewDashboardRoutingModule {}

