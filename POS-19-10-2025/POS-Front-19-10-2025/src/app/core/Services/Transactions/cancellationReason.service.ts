import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class CancellationReasonService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/CancellationReason/FirstOpen");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/CancellationReason/GetByDocumentID/" + DocumentID);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/CancellationReason/PreAddUpdateAsync");
  }

  Transactions(model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/CancellationReason/Insert", model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/CancellationReason/Update", model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/CancellationReason/Delete/" + model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/CancellationReason/Pagination/" + pageNumber);
  }

  getGrideList() {
    return this.http.get(this.common.rooturl + "/CancellationReason/GetGrideList");
  }
}
