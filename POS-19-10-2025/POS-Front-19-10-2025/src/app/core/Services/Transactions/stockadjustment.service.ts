import { Injectable } from "@angular/core";
import { HttpClient, CommonService } from "src/app/shared/Directives/pagetransactionsimport";

@Injectable({
  providedIn: "root"
})
export class StockadjustmentService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/Stockadjustment/FirstOpen");
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Stockadjustment/PreAddUpdate");
  }
  GetAllInventories() {
    return this.http.get(this.common.rooturl + "/Stockadjustment/GetAllInventories");
  }

  Transactions(stockadjustment: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Stockadjustment/PostStockadjustment/", stockadjustment);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Stockadjustment/PutStockadjustment/", stockadjustment);
    }
    if (functiontype == "Delete") {
      return this.http.delete(
        this.common.rooturl + "/Stockadjustment/DeleteStockadjustment/" + stockadjustment.DocumentId
      );
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Stockadjustment/Pagination/" + pageNumber);
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/Stockadjustment/GetByDocumentId/" + DocumentId);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/Stockadjustment/GetGrideList");
  }
  assignAvailabeQuantyToDetails(stockadjustment: any) {
    return this.http.post(this.common.rooturl + "/Stockadjustment/AssignAvailabeQuantyToDetails/", stockadjustment);
  }
}
