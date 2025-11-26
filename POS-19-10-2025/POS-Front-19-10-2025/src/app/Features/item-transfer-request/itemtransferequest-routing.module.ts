import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";

import { ItemtransferrequestComponent } from "./itemtransferrequest/itemtransferrequest.component";
import { ItemtransferrequestlistComponent } from "./itemtransferrequestlist/itemtransferrequestlist.component";

const routes: Routes = [
  {
    path: "",
    component: ItemtransferrequestComponent,
    data: ["transferrequest", "transferrequestlist"]
  },
  {
    path: "transferrequestlist",
    component: ItemtransferrequestlistComponent,
    data: ["transferrequest", "transferrequestlist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemTransferRequestRoutingModule {}
