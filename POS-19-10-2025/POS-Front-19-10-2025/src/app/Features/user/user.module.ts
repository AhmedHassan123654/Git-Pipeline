import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { UserdetailsComponent } from "./userdetails/userdetails.component";
import { UserdetailslistComponent } from "./userdetailslist/userdetailslist.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { UserRoutingModule } from "./user-routing.module";
import { AngularDraggableModule } from "angular2-draggable";
import { SharedModule } from "../../shared/shared.module";

@NgModule({
  declarations: [UserdetailsComponent, UserdetailslistComponent],
  imports: [CommonModule, UserRoutingModule, FormsModule, ReactiveFormsModule, SharedModule, AngularDraggableModule]
})
export class UserModule {}
