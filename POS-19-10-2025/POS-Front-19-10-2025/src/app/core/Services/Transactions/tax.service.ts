import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root"
})
export class TaxService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/Tax/FirstOpen");
  }
  taxFirstOpen() {
    return this.http.get(this.common.rooturl + "/Tax/TaxFirstOpen");
  }
  assignTaxFirstOpen() {
    return this.http.get(this.common.rooturl + "/Tax/AssignTaxFirstOpen");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/Tax/GetByDocumentID/" + DocumentID);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Tax/PreAddUpdateAsync");
  }

  Transactions(model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Tax/Insert", model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Tax/Update", model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Tax/Delete/" + model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Tax/Pagination/" + pageNumber);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/Tax/print/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/Tax/GetGrideList");
  }
  insertOrUpdateProductTaxes(model) {
    return this.http.post(this.common.rooturl + "/Tax/InsertOrUpdateProductTaxes/", model);
  }
}
