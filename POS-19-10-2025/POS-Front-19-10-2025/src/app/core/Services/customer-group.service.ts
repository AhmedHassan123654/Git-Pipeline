import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CustomerGroups } from "../Models/customer-groups";
import { CommonService } from "./Common/common.service";

@Injectable({
  providedIn: "root"
})
export class CustomerGroupService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/CustomerGroup/FirstOpen");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/CustomerGroup/GetByDocumentID/" + DocumentId);
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/CustomerGroup/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/CustomerGroup/PreAddUpdateAsync");
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/CustomerGroup/GetGrideList");
  }
  getLockups() {
    return this.http.get(this.common.rooturl + "/CustomerGroup/GetLockups");
  }
  Transactions(Model: CustomerGroups, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/CustomerGroup/InsertCustomerGroup/", Model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/CustomerGroup/UpdateCustomerGroup/", Model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/CustomerGroup/DeleteCustomerGroup/" + Model.DocumentId);
    }
  }
}
