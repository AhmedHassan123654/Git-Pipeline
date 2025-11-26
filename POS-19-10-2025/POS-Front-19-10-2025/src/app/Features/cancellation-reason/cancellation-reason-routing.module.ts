import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CancellationReasonListComponent } from "./cancellation-reason-list/cancellation-reason-list.component";
import { CancellationReasonComponent } from "./cancellation-reason/cancellation-reason.component";

const routes: Routes = [
  {
    path: "",
    component: CancellationReasonComponent,
    data: ["CancellationReason", "CancellationReasonlist"]
  },
  {
    path: "CancellationReasonlist",
    component: CancellationReasonListComponent,
    data: ["CancellationReason", "CancellationReasonlist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CancellationReasonRoutingModule {}
