import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root"
})
export class ServiceChargeService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/ServiceCharge/FirstOpen");
  }
  taxFirstOpen() {
    return this.http.get(this.common.rooturl + "/ServiceCharge/TaxFirstOpen");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/ServiceCharge/GetByDocumentID/" + DocumentID);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/ServiceCharge/PreAddUpdateAsync");
  }

  Transactions(model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/ServiceCharge/Insert", model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/ServiceCharge/Update", model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/ServiceCharge/Delete/" + model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/ServiceCharge/Pagination/" + pageNumber);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/ServiceCharge/print/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/ServiceCharge/GetGrideList");
  }
}
