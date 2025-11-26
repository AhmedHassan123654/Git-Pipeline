import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { CancellationReasonRoutingModule } from "./cancellation-reason-routing.module";
import { CancellationReasonComponent } from "./cancellation-reason/cancellation-reason.component";
import { SharedModule } from "src/app/shared/shared.module";
import { CancellationReasonListComponent } from "./cancellation-reason-list/cancellation-reason-list.component";

@NgModule({
  declarations: [CancellationReasonComponent, CancellationReasonListComponent],
  imports: [CommonModule, SharedModule, CancellationReasonRoutingModule]
})
export class CancellationReasonModule {}
