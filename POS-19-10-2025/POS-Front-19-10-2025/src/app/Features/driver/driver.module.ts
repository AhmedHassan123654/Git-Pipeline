import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DriverRoutingModule } from "./driver-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { DriversComponent } from "./drivers/drivers.component";
import { DriversListComponent } from "./drivers-list/drivers-list.component";

@NgModule({
  declarations: [DriversComponent, DriversListComponent],
  imports: [CommonModule, DriverRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class DriverModule {}
