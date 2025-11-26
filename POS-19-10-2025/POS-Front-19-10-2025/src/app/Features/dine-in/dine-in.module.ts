import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { DineInRoutingModule } from "./dine-in-routing.module";
import { TablesComponent } from "./tables/tables.component";
import { TabsComponent } from "./tabs/tabs.component";
import { FormsModule } from "@angular/forms";

@NgModule({
  declarations: [TablesComponent, TabsComponent],
  imports: [CommonModule, DineInRoutingModule, FormsModule]
})
export class DineInModule {}
