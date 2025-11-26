import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root"
})
export class PaymentSystemService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/PaymentSystem/FirstOpen");
  }
  paymentSystemFirstOpen() {
    return this.http.get(this.common.rooturl + "/PaymentSystem/PaymentSystemFirstOpen");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/PaymentSystem/GetByDocumentID/" + DocumentID);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/PaymentSystem/PreAddUpdate");
  }

  Transactions(model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/PaymentSystem/Insert", model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/PaymentSystem/Update", model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/PaymentSystem/Delete/" + model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/PaymentSystem/Pagination/" + pageNumber);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/PaymentSystem/print/", model);
  }
  printAfterAdd(model: any) {
    return this.http.post(this.common.rooturl + "/PaymentSystem/printAfterAdd/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/PaymentSystem/GetGrideList");
  }
}
