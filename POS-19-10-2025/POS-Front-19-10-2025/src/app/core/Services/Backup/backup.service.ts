import { Injectable } from "@angular/core";
import { CommonService, HttpClient } from "src/app/shared/Directives/pagetransactionsimport";

@Injectable({
  providedIn: "root"
})
export class BackupService {
  constructor(private http: HttpClient, private common: CommonService) {}
  backup() {
    return this.http.get(this.common.rooturl + "/Backup/Backup");
  }
  firstOpen() {
    return this.http.get(this.common.rooturl + "/Backup/FirstOpen");
  }
  updatePOSToLastVersion() {
    return this.http.get(this.common.rooturl + "/Backup/UpdatePOSToLastVersion");
  }
  update(model: any) {
    return this.http.put(this.common.rooturl + "/Backup/Update", model);
  }
  restore(model: any) {
    return this.http.post(this.common.rooturl + "/Backup/Restore", model);
  }
}
