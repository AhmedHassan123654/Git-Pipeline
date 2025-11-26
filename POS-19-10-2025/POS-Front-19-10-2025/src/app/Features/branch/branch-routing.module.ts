import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { BranchComponent } from "./branch/branch.component";
import { BranchListComponent } from "./branch-list/branch-list.component";
const routes: Routes = [
  { path: "", component: BranchComponent, data: ["branch", "branchList"] },
  {
    path: "branchList",
    component: BranchListComponent,
    data: ["branch", "branchList"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchRoutingModule {}
