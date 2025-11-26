import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { ReturnorderComponent } from "./returnorder/returnorder.component";
import { ReturnorderlistComponent } from "./returnorderlist/returnorderlist.component";
// import { EditorderComponent } from "./editorder/editorder.component";

const routes: Routes = [
  {
    path: "",
    component: ReturnorderComponent,
    data: ["returnorder", "returnorderlist"]
  },
  {
    path: "returnorderlist",
    component: ReturnorderlistComponent,
    data: ["returnorder", "returnorderlist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReturnOrderRoutingModule {}
