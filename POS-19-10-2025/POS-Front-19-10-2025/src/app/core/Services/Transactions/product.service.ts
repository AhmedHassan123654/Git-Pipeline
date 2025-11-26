import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root"
})
export class ProductService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/Product/FirstOpen");
  }
  productFirstOpen() {
    return this.http.get(this.common.rooturl + "/Product/ProductFirstOpenAsync");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/Product/GetByDocumentID/" + DocumentID);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Product/PreAddUpdateAsync");
  }
  getProducts() {
    return this.http.get(this.common.rooturl + "/Product/GetProducts");
  }
  getProductsLookUps() {
    return this.http.get(this.common.rooturl + "/Product/GetProductsLookUps");
  }

  Transactions(model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Product/InsertProduct", model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Product/UpdateProduct", model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Product/DeleteProduct/" + model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Product/Pagination/" + pageNumber);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/Product/print/", model);
  }
  InsertProductsFromExcel(models: any) {
    return this.http.post(this.common.rooturl + "/Product/InsertProductsFromExcel/", models);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/Product/GetGrideList");
  }
  GetProductCount() {
    return this.http.get(this.common.rooturl + "/Product/GetProductCount");
  }
}
