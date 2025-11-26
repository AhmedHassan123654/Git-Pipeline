import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class MinimumChargeService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/MinimumCharge/FirstOpen");
  }
  minimumChargeFirstOpen() {
    return this.http.get(this.common.rooturl + "/MinimumCharge/MinimumChargeFirstOpenAsync");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/MinimumCharge/GetByDocumentID/" + DocumentId);
  }

  Transactions(Model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/MinimumCharge/Insert/", Model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/MinimumCharge/Update/", Model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/MinimumCharge/Delete/" + Model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/MinimumCharge/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/MinimumCharge/PreAddUpdate");
  }
  /*  print(model:any)
  {
    return this.http.post(this.common.rooturl+'/MinimumCharge/print/',model);
  } */
  printAfterAdd(model: any) {
    return this.http.post(this.common.rooturl + "/MinimumCharge/printAfterAdd/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/MinimumCharge/GetGrideList");
  }
}
