import { Injectable } from "@angular/core";
import { PricingClassModel } from "../../Models/Transactions/pricing-class-model";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
@Injectable({
  providedIn: "root"
})
export class PricingClassesService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/PricingClasses/FirstOpen");
  }

  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/PricingClasses/GetByDocumentID/" + DocumentId);
  }
  GetproductGroups(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/PricingClasses/GetproductGroups/" + DocumentId);
  }

  Transactions(pricingClassModel: PricingClassModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/PricingClasses/InsertPricingClass/", pricingClassModel);
    }
    if (functiontype == "PostProduct") {
      return this.http.post(this.common.rooturl + "/PricingClasses/InsertProductPricingClasses/", pricingClassModel);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/PricingClasses/UpdatePricingClass/", pricingClassModel);
    }
    if (functiontype == "Delete") {
      return this.http.delete(
        this.common.rooturl + "/PricingClasses/DeletePricingClass/" + pricingClassModel.DocumentId
      );
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/PricingClasses/Pagination/" + pageNumber);
  }

  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/PricingClasses/PreAddUpdate");
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/PricingClasses/print/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/PricingClasses/GetGrideList");
  }
}
