import { Injectable } from "@angular/core";
import { CommonService, HttpClient } from "src/app/shared/Directives/pagetransactionsimport";
import { PromoModel } from "../../Models/Transactions/PromoModel";

@Injectable({
  providedIn: "root"
})
export class PromoService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/Promo/FirstOpen");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/Promo/GetByDocumentID/" + DocumentID);
  }

  Transactions(model: PromoModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Promo/InsertPromoAsync/", model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Promo/UpdatePromoAsync/", model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Promo/DeletePromoAsync/" + model.DocumentId);
    }
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/Promo/GetGrideList");
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Promo/PreAddUpdate");
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Promo/Pagination/" + pageNumber);
  }
}
