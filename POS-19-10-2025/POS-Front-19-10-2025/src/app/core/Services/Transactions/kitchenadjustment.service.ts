import { Injectable } from "@angular/core";
import { HttpClient, CommonService } from "src/app/shared/Directives/pagetransactionsimport";

@Injectable({
  providedIn: "root"
})
export class KitchenadjustmentService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/KitchenAdjustment/FirstOpen");
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/KitchenAdjustment/PreAddUpdate");
  }
  GetAllInventories() {
    return this.http.get(this.common.rooturl + "/KitchenAdjustment/GetAllInventories");
  }

  Transactions(stockadjustment: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/KitchenAdjustment/PostStockadjustment/", stockadjustment);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/KitchenAdjustment/PutStockadjustment/", stockadjustment);
    }
    if (functiontype == "Delete") {
      return this.http.delete(
        this.common.rooturl + "/KitchenAdjustment/DeleteStockadjustment/" + stockadjustment.DocumentId
      );
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/KitchenAdjustment/Pagination/" + pageNumber);
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/KitchenAdjustment/GetByDocumentId/" + DocumentId);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/KitchenAdjustment/GetGrideList");
  }
  assignAvailabeQuantyToDetails(stockadjustment: any) {
    return this.http.post(this.common.rooturl + "/KitchenAdjustment/AssignAvailabeQuantyToDetails/", stockadjustment);
  }
}
