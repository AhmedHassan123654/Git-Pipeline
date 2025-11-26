import { Injectable } from "@angular/core";
import { ProductGroupModel } from "src/app/Features/product-group/product-groupimports";
import { CommonService, HttpClient } from "src/app/shared/Directives/pagetransactionsimport";

@Injectable({
  providedIn: "root"
})
export class ProductGroupService {
  constructor(private http: HttpClient, private common: CommonService) {}
  Transactions(ProductGroupModel: ProductGroupModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/ProductGroup/InsertProductGroup/", ProductGroupModel);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/ProductGroup/UpdateProductGroup/", ProductGroupModel);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/ProductGroup/DeleteProductGroup/" + ProductGroupModel.DocumentId);
    }
  }
  firstOpen() {
    return this.http.get(this.common.rooturl + "/ProductGroup/FirstOpen");
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/ProductGroup/GetGrideList");
  }
  GetProductGroupsLookUps() {
    return this.http.get(this.common.rooturl + "/ProductGroup/GetProductGroupsLookUps");
  }

  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/ProductGroup/GetByDocumentID/" + DocumentId);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/ProductGroup/PreAddUpdate");
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/ProductGroup/Pagination/" + pageNumber);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/ProductGroup/print/", model);
  }
  UploadImages(formData: any, FormGroupId: any) {
    return this.http.post(this.common.rooturl + "/ProductGroup/UploadImages/" + FormGroupId, formData);
  }
}
