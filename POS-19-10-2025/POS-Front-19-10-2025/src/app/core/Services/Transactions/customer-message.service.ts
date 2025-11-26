import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class CustomerMessageService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/CustomerMessage/FirstOpen");
  }

  GetByDocumentID(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/CustomerMessage/GetByDocumentID/" + DocumentId);
  }
  GetCustomersCount(Model: any) {
    return this.http.post(this.common.rooturl + "/CustomerMessage/GetCustomersCount" , Model);
  }

  Transactions(Model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/CustomerMessage/InsertAsync/", Model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/CustomerMessage/UpdateAsync/", Model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/CustomerMessage/DeleteAsync/" + Model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/CustomerMessage/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/CustomerMessage/PreAddUpdate");
  }
  printAfterAdd(model: any) {
    return this.http.post(this.common.rooturl + "/CustomerMessage/printAfterAdd/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/CustomerMessage/GetGrideList");
  }
}
