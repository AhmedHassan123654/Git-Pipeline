import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { FeedemployeesRoutingModule } from "./feedemployees-routing.module";

import { FeedemployeesListComponent } from "./feedemployees-list/feedemployees-list.component";
import { ConnectmealsComponent } from "./connectmeals/connectmeals.component";
import { ConnecemployeesComponent } from "./connecemployees/connecemployees.component";
import { FeedemployeesComponent } from "./feedemployees/feedemployees.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { PaginationModule } from "ngx-bootstrap/pagination";
FeedemployeesComponent;
@NgModule({
  declarations: [FeedemployeesComponent, FeedemployeesListComponent, ConnectmealsComponent, ConnecemployeesComponent],
  imports: [
    CommonModule,
    FeedemployeesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    AccordionModule.forRoot(),
    PaginationModule.forRoot()
  ]
})
export class FeedemployeesModule {}
