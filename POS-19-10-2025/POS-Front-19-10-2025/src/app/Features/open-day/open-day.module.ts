import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OpenDayRoutingModule } from "./open-day-routing.module";
import { OpenDayListComponent } from "./open-day-list/open-day-list.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [OpenDayListComponent],
  imports: [CommonModule, OpenDayRoutingModule, SharedModule]
})
export class OpenDayModule {}
