import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CategoryModel } from "../../Models/Transactions/category-model";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class CategoryService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/Category/FirstOpen");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/Category/GetByDocumentID/" + DocumentID);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Category/PreAddUpdate");
  }

  Transactions(Category: CategoryModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Category/InsertCategory", Category);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Category/UpdateCategory", Category);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Category/DeleteCategory/" + Category.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Category/Pagination/" + pageNumber);
  }

  getGrideList() {
    return this.http.get(this.common.rooturl + "/Category/GetGrideList");
  }
}
