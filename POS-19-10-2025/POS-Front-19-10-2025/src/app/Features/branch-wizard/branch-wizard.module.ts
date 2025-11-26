import { NgModule } from "@angular/core";
import { BranchWizardRoutingModule } from "./branch-wizard-routing.module";
import { BranchWizardComponent } from "./branch-wizard/branch-wizard.component";
import { MatInputModule } from "@angular/material/input";
import { SharedModule } from "src/app/shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { BrowserModule } from "@angular/platform-browser";
import { MatDialogModule } from "@angular/material/dialog";

@NgModule({
  declarations: [BranchWizardComponent],
  imports: [BrowserModule, BranchWizardRoutingModule, FormsModule, ReactiveFormsModule, SharedModule, MatDialogModule]
})
export class BranchWizardModule {}
