import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { AssigndriverComponent } from "./assigndriver/assigndriver.component";

const routes: Routes = [
  // {
  //   path: '',
  //   component: AppLayoutComponent,
  //   canActivateChild:[AuthGuard],
  //   children: [
  { path: "", component: AssigndriverComponent, pathMatch: "full" }
  //   ]

  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssignDriverRoutingModule {}
