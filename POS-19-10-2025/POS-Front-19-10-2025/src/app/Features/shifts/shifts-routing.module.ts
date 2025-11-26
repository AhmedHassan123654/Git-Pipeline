import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { ShiftlistComponent } from "./shiftlist/shiftlist.component";

import { ShiftsComponent } from "./shifts/shifts.component";

const routes: Routes = [
  { path: "", component: ShiftsComponent, data: ["shifts", "Shiftlist"] },
  {
    path: "Shiftlist",
    component: ShiftlistComponent,
    data: ["shifts", "Shiftlist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ShiftsRoutingModule {}
