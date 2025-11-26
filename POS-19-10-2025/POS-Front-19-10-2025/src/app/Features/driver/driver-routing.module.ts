import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";
import { DriversComponent } from "./drivers/drivers.component";
import { DriversListComponent } from "./drivers-list/drivers-list.component";

const routes: Routes = [
  { path: "", component: DriversComponent, data: ["driver", "driverlist"] },
  {
    path: "driverlist",
    component: DriversListComponent,
    data: ["driver", "driverlist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DriverRoutingModule {}
