import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SyncToTaxAuthorityComponent } from "./sync-to-tax-authority/sync-to-tax-authority.component";

const routes: Routes = [{ path: "", component: SyncToTaxAuthorityComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SyncToTaxAuthorityRoutingModule {}
