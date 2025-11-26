import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "src/app/shared/shared.module";
import { BackupRoutingModule } from "./backup/backup-routing.module";
import { BackupComponent } from "./backup/backup.component";

@NgModule({
  declarations: [BackupComponent],
  imports: [CommonModule, BackupRoutingModule, FormsModule, ReactiveFormsModule, SharedModule]
})
export class BackupsModule {}
