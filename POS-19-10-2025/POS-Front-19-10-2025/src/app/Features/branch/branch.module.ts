import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BranchComponent } from "./branch/branch.component";
import { BranchRoutingModule } from "./branch-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { BranchListComponent } from "./branch-list/branch-list.component";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [BranchComponent, BranchListComponent],
  imports: [
    CommonModule,
    BranchRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    HttpClientModule,

    AccordionModule.forRoot()
  ]
})
export class BranchModule {}
