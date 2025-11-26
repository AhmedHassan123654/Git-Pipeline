import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AppLayoutComponent } from "src/app/shared/app-layout/app-layout.component";
import { AuthGuard } from "src/app/core/Helper/auth-guard";

import { ReceivingtransferComponent } from "./receivingtransfer/receivingtransfer.component";
import { ReceivingtransferlistComponent } from "./receivingtransferlist/receivingtransferlist.component";

const routes: Routes = [
  {
    path: "",
    component: ReceivingtransferComponent,
    data: ["RreceivingTransfer", "receivingtransferlist"]
  },
  {
    path: "receivingtransferlist",
    component: ReceivingtransferlistComponent,
    data: ["RreceivingTransfer", "receivingtransferlist"]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReceivingtransferRoutingModule {}
