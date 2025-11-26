import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ServerSyncComponent } from "./server-sync/server-sync.component";
import { ServerSyncRoutingModule } from "./server-sync-routing.module";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations: [ServerSyncComponent],
  imports: [CommonModule, ServerSyncRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class ServerSyncModule {}
