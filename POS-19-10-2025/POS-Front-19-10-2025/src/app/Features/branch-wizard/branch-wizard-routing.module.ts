import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BranchWizardComponent } from "./branch-wizard/branch-wizard.component";

const routes: Routes = [
  {
    path: "",
    component: BranchWizardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchWizardRoutingModule {}
