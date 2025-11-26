import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { MyPointsRoutingModule } from "./my-points-routing.module";
import { MyPointsComponent } from "./my-points/my-points.component";
import { SharedModule } from "src/app/shared/shared.module";
import { PaginationModule } from "ngx-bootstrap/pagination";

@NgModule({
  declarations: [MyPointsComponent],
  imports: [CommonModule, MyPointsRoutingModule, SharedModule, PaginationModule]
})
export class MyPointsModule {}
