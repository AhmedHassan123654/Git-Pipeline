import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DailyStock } from "../../Models/Transactions/daily-stock";
import { CommonService } from "../Common/common.service";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DailyStockService {
  showCopy: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/DailyStock/FirstOpen");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/DailyStock/GetByDocumentID/" + DocumentId);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/DailyStock/print/", model);
  }
  Transactions(DailyStock: DailyStock, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/DailyStock/InsertDailyStock/", DailyStock);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/DailyStock/UpdateDailyStock/", DailyStock);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/DailyStock/DeleteDailyStock/" + DailyStock.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/DailyStock/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/DailyStock/PreAddUpdate");
  }

  getGrideList() {
    return this.http.get(this.common.rooturl + "/DailyStock/GetGrideList");
  }
}
