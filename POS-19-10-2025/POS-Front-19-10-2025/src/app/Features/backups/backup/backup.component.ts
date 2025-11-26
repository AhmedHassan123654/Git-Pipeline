import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { BackupService } from "src/app/core/Services/Backup/backup.service";
import { ToastrService } from "ngx-toastr";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { Router } from "@angular/router";
@Component({
  selector: "app-backup",
  templateUrl: "./backup.component.html",
  styleUrls: ["./backup.component.scss"]
})
export class BackupComponent implements OnInit {
  [key: string]: any;
  fields = { text: "Name", value: "Id" };
  constructor(
    private translate: TranslateService,
    private backupService: BackupService,
    private toastr: ToastrService,
    public router: Router,
    private toastrMessage: HandlingBackMessages,
    private languageSerService: LanguageSerService
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  ngOnInit(): void {
    this.show = true;
    this.disabled = true;
    this.firstOpen();
  }
  // Update POS to latest version
  updatePos() {
    this.isUpdating = true;
    this.backupService.updatePOSToLastVersion().subscribe((res) => {
      // if(res) location.reload();
      // this.isUpdating = false;
    },error=>{
      // this.isUpdating = false;
    });
  }
  firstOpen() {
    this.backupService.firstOpen().subscribe((res:any) => {
      this.backupModel = res;
      this.currentVersion = res.currentVersion;
      this.latestVersion = res.latestVersion;
      this.backupDurationTypes = [
        { Id: 1, Name: this.translate.instant("setting.Hours") },
        { Id: 2, Name: this.translate.instant("setting.Days") },
      ];
    });

  }
  backup() {
    if (this.requestStarted) return;
    this.requestStarted = true;
    this.backupService.backup().subscribe((res) => {
      this.requestStarted = false;
      if (res == 2) {
        this.toastr.success(this.translate.instant("Shared.doBackup"), this._pagename);
      } else {
        this.toastr.error(this.toastrMessage.GlobalMessages(res), this._pagename);
      }
    },error=>{
      this.requestStarted = false;
    });
  }
  update(model: any) {
    this.backupService.update(model).subscribe((res) => {
      if (res == 2) {
        this.toastr.success(this.toastrMessage.GlobalMessages(res), this._pagename);
      } else {
        this.toastr.error(this.toastrMessage.GlobalMessages(res), this._pagename);
      }
    });
  }
  restorePath: string = "";
  restore() {
    if (this.requestStarted) return;
    this.requestStarted = true;
    const model = { Path: this.restorePath };
    this.backupService.restore(model).subscribe((res) => {
      this.requestStarted = false;
      if (res == 2)
        this.toastr.success(this.toastrMessage.GlobalMessages(res), this._pagename);
      else
        this.toastr.error(this.toastrMessage.GlobalMessages(res), this._pagename);
      this.logout();
    },error=>{
      this.requestStarted = false;
    });
  }
  logout() {
    localStorage.removeItem("token");
    setTimeout(() => {
      this.router.navigateByUrl("/login");
      location.reload();
    }, 200);
  }
}
