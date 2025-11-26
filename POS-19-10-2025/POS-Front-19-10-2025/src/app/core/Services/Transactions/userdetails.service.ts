import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { UserDetailsModel } from "../../Models/Authentication/userDetails.model";
@Injectable({
  providedIn: "root"
})
export class UserDetailsService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/User/FirstOpen");
  }
  /*  print(model:any)
  {
    return this.http.post(this.common.rooturl+'/User/print/',model);
  } */
  getGrideList() {
    return this.http.get(this.common.rooturl + "/User/GetGrideList");
  }
  GetAllUserDetails() {
    return this.http.get(this.common.rooturl + "/UserDetails/GetAllUserDetails");
  }
  GetAllEmps() {
    return this.http.get(this.common.rooturl + "/User/GetAllEmps");
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/User/PreAddUpdate");
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/User/Pagination/" + pageNumber);
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/User/GetUserById/" + DocumentID);
  }
  Transactions(user: UserDetailsModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/User/AddUser", user);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/User/UpdateUser/", user);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/User/DeleteUser/" + user.DocumentId);
    }
  }
}
