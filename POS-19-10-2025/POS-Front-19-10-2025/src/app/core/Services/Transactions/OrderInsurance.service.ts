import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root"
})
export class OrderInsuranceService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/OrderInsurance/FirstOpen");
  }
  orderInsuranceFirstOpen() {
    return this.http.get(this.common.rooturl + "/OrderInsurance/OrderInsuranceFirstOpen");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/OrderInsurance/GetByDocumentID/" + DocumentID);
  }
  getByCustomerOrderDocumentID(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/OrderInsurance/GetByCustomerOrderDocumentID/" + DocumentID);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/OrderInsurance/PreAddUpdateAsync");
  }

  Transactions(model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/OrderInsurance/Insert", model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/OrderInsurance/Update", model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/OrderInsurance/Delete/" + model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/OrderInsurance/Pagination/" + pageNumber);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/OrderInsurance/print/", model);
  }
  printAfterAdd(model: any) {
    return this.http.post(this.common.rooturl + "/OrderInsurance/printAfterAdd/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/OrderInsurance/GetGrideList");
  }
  getOrderWithOrderInsurance(model) {
    return this.http.post(this.common.rooturl + "/OrderInsurance/GetOrderWithOrderInsurance", model);
  }
}
