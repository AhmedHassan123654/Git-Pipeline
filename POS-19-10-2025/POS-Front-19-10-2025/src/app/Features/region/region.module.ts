import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RegionRoutingModule } from "./region-routing.module";
import { RegionComponent } from "./region/region.component";
import { RegionListComponent } from "./region-list/region-list.component";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [RegionComponent, RegionListComponent],
  imports: [CommonModule, RegionRoutingModule, SharedModule]
})
export class RegionModule {}
