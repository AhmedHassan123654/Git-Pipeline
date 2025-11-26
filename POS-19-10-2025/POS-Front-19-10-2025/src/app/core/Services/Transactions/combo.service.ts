import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root"
})
export class ComboService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/CompoProduct/FirstOpen");
  }
  comboFirstOpen() {
    return this.http.get(this.common.rooturl + "/CompoProduct/ComboFirstOpen");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/CompoProduct/GetByDocumentID/" + DocumentID);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/CompoProduct/PreAddUpdateAsync");
  }

  Transactions(model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/CompoProduct/Insert", model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/CompoProduct/Update", model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/CompoProduct/Delete/" + model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/CompoProduct/Pagination/" + pageNumber);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/CompoProduct/print/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/CompoProduct/GetGrideList");
  }
}
