import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
@Injectable({
  providedIn: "root"
})
export class ExtraExpensesTypeService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/ExtraExpensesType/FirstOpen");
  }

  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/ExtraExpensesType/GetByDocumentID/" + DocumentId);
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/ExtraExpensesType/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/ExtraExpensesType/PreAddUpdate");
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/ExtraExpensesType/GetGrideList");
  }

  Transactions(model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/ExtraExpensesType/InsertExtraExpensesType/", model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/ExtraExpensesType/UpdateExtraExpensesType/", model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/ExtraExpensesType/DeleteExtraExpensesType/" + model.DocumentId);
    }
  }
}
