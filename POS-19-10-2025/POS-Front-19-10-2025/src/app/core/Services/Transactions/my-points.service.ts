import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class MyPointsService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/MyPoints/FirstOpen");
  }
  myPointsFirstOpenAsync() {
    return this.http.get(this.common.rooturl + "/MyPoints/MyPointsFirstOpenAsync");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/MyPoints/GetByDocumentID/" + DocumentId);
  }

  Transactions(Model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/MyPoints/Insert/", Model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/MyPoints/Update/", Model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/MyPoints/Delete/" + Model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/MyPoints/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/MyPoints/PreAddUpdate");
  }
  /*  print(model:any)
  {
    return this.http.post(this.common.rooturl+'/MinimumCharge/print/',model);
  } */
  printAfterAdd(model: any) {
    return this.http.post(this.common.rooturl + "/MyPoints/printAfterAdd/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/MyPoints/GetGrideList");
  }
}
