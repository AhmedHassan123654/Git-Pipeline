import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RegionListComponent } from "./region-list/region-list.component";
import { RegionComponent } from "./region/region.component";

const routes: Routes = [
  { path: "", component: RegionComponent, data: ["region", "regionlist"] },
  {
    path: "regionlist",
    component: RegionListComponent,
    data: ["region", "regionlist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionRoutingModule {}
