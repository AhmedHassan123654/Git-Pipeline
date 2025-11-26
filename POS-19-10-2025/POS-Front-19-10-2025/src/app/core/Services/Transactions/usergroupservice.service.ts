import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class UsergroupserviceService {
  constructor(private http: HttpClient, private common: CommonService) {}

  /*  getAllData(state?: any): Observable<any[]> {
    return this.http
      .get<any[]>(
        this.common.rooturl +
          "/UserGroup/Pagination/" +
          state.action.currentPage +
          "/" +
          state.take
      )
      .map(
        (response: any) =>
          ({
            result: response.Item1,
            count: response.Item2,
          } as any)
      )
      .map((data: any) => data);
  } */
  firstOpen() {
    return this.http.get(this.common.rooturl + "/UserGroup/FirstOpen");
  }
  getAllUserGroups() {
    return this.http.get(this.common.rooturl + "/UserGroup/GetAllUserGroups");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/UserGroup/GetByDocumentID/" + DocumentId);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/UserGroup/PreAddUpdate");
  }
  Transactions(usergroup: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/UserGroup/PostUserGroup/", usergroup);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/UserGroup/PutUserGroup/", usergroup);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/UserGroup/DeleteUserGroup/" + usergroup.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/UserGroup/Pagination/" + pageNumber);
  }
}
