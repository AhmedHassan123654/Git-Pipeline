import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { UserdetailsComponent } from "./userdetails/userdetails.component";
import { UserdetailslistComponent } from "./userdetailslist/userdetailslist.component";

const routes: Routes = [
  {
    path: "",
    component: UserdetailsComponent,
    data: ["user", "userdetailslist"]
  },
  {
    path: "userdetailslist",
    component: UserdetailslistComponent,
    data: ["user", "userdetailslist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {}
