import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { POSDashBoardComponent } from "./posdash-board/posdash-board.component";

const routes: Routes = [{ path: "", component: POSDashBoardComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class POSDashboardRoutingModule {}
