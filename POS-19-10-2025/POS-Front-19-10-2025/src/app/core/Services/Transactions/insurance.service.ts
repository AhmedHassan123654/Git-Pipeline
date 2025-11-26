import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root"
})
export class InsuranceService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/Insurance/FirstOpen");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/Insurance/GetByDocumentID/" + DocumentID);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Insurance/PreAddUpdateAsync");
  }
  Transactions(model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Insurance/Insert", model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Insurance/Update", model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Insurance/Delete/" + model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Insurance/Pagination/" + pageNumber);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/Insurance/print/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/Insurance/GetGrideList");
  }
}
