import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SyncToTaxAuthorityRoutingModule } from "./sync-to-tax-authority-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import { SyncToTaxAuthorityComponent } from "./sync-to-tax-authority/sync-to-tax-authority.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [SyncToTaxAuthorityComponent],
  imports: [CommonModule, SyncToTaxAuthorityRoutingModule, SharedModule, FormsModule, ReactiveFormsModule]
})
export class SyncToTaxAuthorityModule {}
