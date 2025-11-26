import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { UserLoginModel } from "../../Models/Transactions/user-login-model";

@Injectable({
  providedIn: "root"
})
export class UserLoginService {
  constructor(private http: HttpClient, private common: CommonService) {}
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/UserLogin/GetByDocumentID/" + DocumentID);
  }
  UserLogin(UserLogin: UserLoginModel) {
    return this.http.post(this.common.rooturl + "/UserLogin/InsertUserLogin", UserLogin);
  }
  UserLogout(UserLogin: UserLoginModel) {
    return this.http.post(this.common.rooturl + "/UserLogin/InsertUserLogout", UserLogin);
  }
  pushToServerInLogout() {
    return this.http.get(this.common.rooturl + "/ServerSync/pushToServerInLogout");
  }
}
