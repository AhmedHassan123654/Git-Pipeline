import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CustomerPromotion } from "../Models/customer-promotion";
import { CommonService } from "./Common/common.service";

@Injectable({
  providedIn: "root"
})
export class CustomerPromotionService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/CustomerPromotion/FirstOpen");
  }
  customerPromotionFirstOpen() {
    return this.http.get(this.common.rooturl + "/CustomerPromotion/CustomerPromotionFirstOpen");
  }

  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/CustomerPromotion/GetByDocumentID/" + DocumentId);
  }

  Transactions(Model: CustomerPromotion, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/CustomerPromotion/InsertCustomerPromotion/", Model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/CustomerPromotion/UpdateCustomerPromotion/", Model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/CustomerPromotion/DeleteCustomerPromotion/" + Model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/CustomerPromotion/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/CustomerPromotion/PreAddUpdate");
  }
  /*  print(model:any)
  {
    return this.http.post(this.common.rooturl+'/CustomerPromotion/print/',model);
  } */
  printAfterAdd(model: any) {
    return this.http.post(this.common.rooturl + "/CustomerPromotion/printAfterAdd/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/CustomerPromotion/GetGrideList");
  }
}
