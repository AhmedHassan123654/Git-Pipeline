import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { OpenDayListComponent } from "./open-day-list/open-day-list.component";

const routes: Routes = [{ path: "", component: OpenDayListComponent }];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpenDayRoutingModule {}
