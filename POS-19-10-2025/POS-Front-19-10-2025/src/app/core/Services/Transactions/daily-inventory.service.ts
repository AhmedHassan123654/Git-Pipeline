import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DailyInventory } from "../../Models/Transactions/daily-inventory";
import { CommonService } from "../Common/common.service";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DailyInventoryService {
  showCopy: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/DailyInventory/FirstOpen");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/DailyInventory/GetByDocumentID/" + DocumentId);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/DailyInventory/print/", model);
  }
  Transactions(DailyInventory: DailyInventory, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/DailyInventory/InsertDailyInventory/", DailyInventory);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/DailyInventory/UpdateDailyInventory/", DailyInventory);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/DailyInventory/DeleteDailyInventory/" + DailyInventory.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/DailyInventory/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/DailyInventory/PreAddUpdate");
  }

  getGrideList() {
    return this.http.get(this.common.rooturl + "/DailyInventory/GetGrideList");
  }
}
