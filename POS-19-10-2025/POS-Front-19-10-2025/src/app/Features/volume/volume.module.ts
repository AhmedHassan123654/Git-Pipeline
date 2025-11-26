import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { VolumeRoutingModule } from "./volume-routing.module";
import { VolumeComponent } from "./volume/volume.component";
import { VolumeListComponent } from "./volume-list/volume-list.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [VolumeComponent, VolumeListComponent],
  imports: [CommonModule, VolumeRoutingModule, SharedModule]
})
export class VolumeModule {}
