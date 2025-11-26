import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExtraexpensesComponent } from "./extraexpenses/extraexpenses.component";
import { ExtraexpenseslistComponent } from "./extraexpenseslist/extraexpenseslist.component";
import { ExtraExpensesRoutingModule } from "./extraexpenses-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { AggregateService } from "@syncfusion/ej2-angular-grids";

@NgModule({
  providers:[AggregateService],
  declarations: [ExtraexpensesComponent, ExtraexpenseslistComponent],
  imports: [CommonModule, ExtraExpensesRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class ExtraExpensesModule {}
