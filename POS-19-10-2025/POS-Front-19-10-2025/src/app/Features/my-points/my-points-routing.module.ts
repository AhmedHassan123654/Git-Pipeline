import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MyPointsComponent } from "./my-points/my-points.component";

const routes: Routes = [
  {
    path: "",
    component: MyPointsComponent,
    data: ["mypoints"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MyPointsRoutingModule {}
