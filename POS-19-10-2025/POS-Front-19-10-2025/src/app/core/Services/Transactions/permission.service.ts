import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class PermissionService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen(GroupID: string) {
    return this.http.get(this.common.rooturl + "/Permission/FirstOpen/" + GroupID);
  }
  GetGroups() {
    return this.http.get(this.common.rooturl + "/Permission/GetGroups");
  }
  GetAllScreens() {
    return this.http.get(this.common.rooturl + "/Permission/GetAllScreens");
  }
  GetPayTypes() {
    return this.http.get(this.common.rooturl + "/Permission/GetPayTypes");
  }
  GetPoints() {
    return this.http.get(this.common.rooturl + "/Permission/GetPoints");
  }
  GetAllUserRoleOption() {
    return this.http.get(this.common.rooturl + "/Permission/GetAllUserRoleOption");
  }
  GetHalls() {
    return this.http.get(this.common.rooturl + "/Permission/GetHalls");
  }
  GetProductGroups() {
    return this.http.get(this.common.rooturl + "/Permission/GetProductGroups");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/Permission/GetByDocumentID/" + DocumentID);
  }

  GetOrderTypes() {
    return this.http.get(this.common.rooturl + "/Permission/GetOrderTypes");
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/Permission/GetGrideList");
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Permission/PreAddUpdate");
  }

  Transactions(permission: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Permission/PostPermission/", permission);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Permission/PutPermission/", permission);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Permission/DeletePermission/" + permission.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Permission/Pagination/" + pageNumber);
  }
}
