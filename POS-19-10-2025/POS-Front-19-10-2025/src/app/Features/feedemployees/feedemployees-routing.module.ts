import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { FeedemployeesComponent } from "./feedemployees/feedemployees.component";
import { FeedemployeesListComponent } from "./feedemployees-list/feedemployees-list.component";
import { ConnectmealsComponent } from "./connectmeals/connectmeals.component";
import { ConnecemployeesComponent } from "./connecemployees/connecemployees.component";
const routes: Routes = [
  {
    path: "",
    component: FeedemployeesComponent,
    data: ["Feedemployees", "FeedemployeesList"]
  },
  {
    path: "FeedemployeesList",
    component: FeedemployeesListComponent,
    data: ["Feedemployees", "FeedemployeesList"]
  },
  {
    path: "Connectmeals",
    component: ConnectmealsComponent,
    data: ["Feedemployees", "FeedemployeesList", "Connectmeals"]
  },
  {
    path: "Connecemployees",
    component: ConnecemployeesComponent,
    data: ["Feedemployees", "FeedemployeesList", "Connecemployees"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FeedemployeesRoutingModule {}
