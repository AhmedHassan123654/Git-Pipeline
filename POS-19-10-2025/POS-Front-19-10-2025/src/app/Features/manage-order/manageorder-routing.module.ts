import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { ManageorderlistComponent } from "./manageorderlist/manageorderlist.component";

const routes: Routes = [{ path: "", component: ManageorderlistComponent, data: ["manageorderlist"] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageOrderRoutingModule {}
