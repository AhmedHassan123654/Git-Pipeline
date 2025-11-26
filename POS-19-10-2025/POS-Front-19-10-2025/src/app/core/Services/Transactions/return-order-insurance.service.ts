import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ReturnOrderInsuranceModel } from "../../Models/Transactions/return-order-Insurance-model";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class ReturnOrderInsuranceService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/ReturnOrderInsurance/FirstOpen");
  }
  GetMaxSerialNumber() {
    return this.http.get(this.common.rooturl + "/ReturnOrderInsurance/GetMaxSerialNumber");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/ReturnOrderInsurance/GetByDocumentID/" + DocumentID);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/ReturnOrderInsurance/PreAddUpdate");
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/ReturnOrderInsurance/Pagination/" + pageNumber);
  }
  GetOrderInsirance(SerialNumber: any) {
    return this.http.get(this.common.rooturl + "/ReturnOrderInsurance/GetOrderInsirance/" + SerialNumber);
  }
  GetOrderInsiranceToCustomer(CustomerDocumentId: any) {
    return this.http.get(this.common.rooturl + "/ReturnOrderInsurance/GetOrderInsiranceToCustomer/" + CustomerDocumentId);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/ReturnOrderInsurance/print/", model);
  }
  printAfterAdd(model: any) {
    return this.http.post(this.common.rooturl + "/ReturnOrderInsurance/printAfterAdd/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/ReturnOrderInsurance/GetGrideList");
  }

  Transactions(ReturnOrderInsurance: ReturnOrderInsuranceModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(
        this.common.rooturl + "/ReturnOrderInsurance/InsertReturnOrderInsuranceAsync",
        ReturnOrderInsurance
      );
    }
    if (functiontype == "Edit") {
      return this.http.put(
        this.common.rooturl + "/ReturnOrderInsurance/UpdateReturnOrderInsuranceAsync",
        ReturnOrderInsurance
      );
    }
    if (functiontype == "Delete") {
      return this.http.delete(
        this.common.rooturl + "/ReturnOrderInsurance/DeleteReturnOrderInsuranceAsync/" + ReturnOrderInsurance.DocumentId
      );
    }
  }
}
