import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SalesTargetModel } from "../Models/Transactions/sales-target-model";
import { CommonService } from "./Common/common.service";

@Injectable({
  providedIn: "root"
})
export class SalesTargetService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/SalesTarget/FirstOpen");
  }

  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/SalesTarget/GetByDocumentID/" + DocumentId);
  }

  Transactions(salestarget: SalesTargetModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/SalesTarget/InsertSalesTarget/", salestarget);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/SalesTarget/UpdateSalesTarget/", salestarget);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/SalesTarget/DeleteSalesTarget/" + salestarget.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/SalesTarget/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/SalesTarget/PreAddUpdate");
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/SalesTarget/print/", model);
  }
  printAfterAdd(model: any) {
    return this.http.post(this.common.rooturl + "/SalesTarget/printAfterAdd/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/SalesTarget/GetGrideList");
  }
}
