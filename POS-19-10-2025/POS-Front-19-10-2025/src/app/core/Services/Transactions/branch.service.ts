import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

import "rxjs/add/operator/map";
import { BranchModel } from "../../Models/Authentication/branch-model";
@Injectable({
  providedIn: "root"
})
export class BranchService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/Branch/FirstOpen");
  }

  branchFirstOpenAsync() {
    return this.http.get(this.common.rooturl + "/Branch/BranchFirstOpenAsync");
  }
  UploadImages(formData: any) {
    return this.http.post(this.common.rooturl + "/Branch/UploadImages/", formData);
  }

  RemoveImages() {
    return this.http.get(this.common.rooturl + "/Branch/RemoveImages");
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Branch/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Branch/PreAddUpdate");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/Branch/GetByDocumentID/" + DocumentId);
  }
  PostRole(Role: any) {
    return this.http.post(this.common.rooturl + "/User/PostRole/", Role);
  }
  RegisterFirstUser(user: any) {
    return this.http.post(this.common.rooturl + "/User/RegisterFirstUser/", user);
  }
  Transactions(branch: BranchModel, functiontype: string) {
    if (functiontype == "Edit") return this.http.put(this.common.rooturl + "/Branch/PutBranch/", branch);

    if (functiontype == "Post") return this.http.post(this.common.rooturl + "/Branch/InsertBranch/", branch);

    if (functiontype == "Delete")
      return this.http.delete(this.common.rooturl + "/Branch/DeleteBranch/" + branch.DocumentId);
  }

  InsertBranchFromOnline(branch: BranchModel) {
    return this.http.post(this.common.rooturl + "/Branch/AddBranch/", branch);
  }

  getGrideList() {
    return this.http.get(this.common.rooturl + "/Branch/GetGrideList");
  }
  getLookUp() {
    return this.http.get(this.common.rooturl + "/Branch/GetLookUp");
  }
  GetAllstocks() {
    return this.http.get(this.common.rooturl + "/Branch/GetAllstocks");
  }
  ChangeTranslationType(data: any) {
    return this.http.post(this.common.rooturl + "/Branch/ChangeTranslationType/", data);
  }
}
