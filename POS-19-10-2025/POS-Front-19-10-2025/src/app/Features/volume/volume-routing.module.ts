import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { VolumeListComponent } from "./volume-list/volume-list.component";
import { VolumeComponent } from "./volume/volume.component";

const routes: Routes = [
  // {
  //   path: "",
  //   component: AppLayoutComponent,
  //   canActivateChild: [AuthGuard],
  //   children: [
  {
    path: "",
    component: VolumeComponent,
    data: ["volume", "volumelist"]
  },
  {
    path: "volumelist",
    component: VolumeListComponent,
    data: ["volume", "volumelist"]
  }
  //   ],
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VolumeRoutingModule {}
