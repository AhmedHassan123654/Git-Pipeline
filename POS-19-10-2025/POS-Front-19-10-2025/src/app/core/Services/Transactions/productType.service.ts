import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root"
})
export class ProductTypeService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/ProductType/FirstOpen");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/ProductType/GetByDocumentID/" + DocumentID);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/ProductType/PreAddUpdateAsync");
  }
  getProductTypes() {
    return this.http.get(this.common.rooturl + "/ProductType/GetProductTypes");
  }

  Transactions(model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/ProductType/InsertProductType", model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/ProductType/UpdateProductType", model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/ProductType/DeleteProductType/" + model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/ProductType/Pagination/" + pageNumber);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/ProductType/print/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/ProductType/GetGrideList");
  }
}
