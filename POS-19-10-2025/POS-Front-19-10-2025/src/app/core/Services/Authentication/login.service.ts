import { Injectable } from "@angular/core";
import { CommonService } from "../Common/common.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LoginModel } from "../../Models/Authentication/login-model";
import { ForgotPasswordModel } from "../../Models/Authentication/forgot-password-model";
import { ResetPasswordModel } from "../../Models/Authentication/reset-password-model";
import { DatabaseDetailModel } from "../../Models/Authentication/database-detail-model";
import { UserLoginModel } from "../../Models/Transactions/user-login-model";

@Injectable({
  providedIn: "root"
})
export class LoginService {
  constructor(private http: HttpClient, private common: CommonService) {}

  // Functions
  Post(Login: LoginModel) {
    return this.http.post(this.common.rooturl + "/User/Login", Login);
  }
  openkeyboard() {
    return this.http.post(this.common.rooturl + "/User/openkeyboard", null);
  }

  // Function ForgotPassword
  FOrgotPassword(forgotpassword: ForgotPasswordModel) {
    return this.http.post(this.common.rooturl + "/User/ForgotPassword", forgotpassword);
  }

  // Function ForgotPassword
  ResetPassword(resetpassword: ResetPasswordModel) {
    return this.http.post(this.common.rooturl + "/User/ResetPassword", resetpassword);
  }

  // Test Connection
  TestConnection(databaseDetail: DatabaseDetailModel) {
    return this.http.post(this.common.rooturl + "/User/TestConnection", databaseDetail);
  }

  // Pull From Server
  PullFromServer(databaseDetail: DatabaseDetailModel) {
    if (databaseDetail.FinancialSystem == 2)
      return this.http.post(this.common.rooturl + "/Integration/PullFromServer", databaseDetail);
    else return this.http.post(this.common.rooturl + "/ServerSync/PullFromServer", databaseDetail);
  }

  // Check If User Exists
  CheckIfUserExists() {
    return this.http.get(this.common.rooturl + "/User/CheckIfUserExists");
  }

  // Set Pull Status
  SetPullStatus() {
    return this.http.get(this.common.rooturl + "/User/SetPullStatus");
  }
  //Get All Counts
  GetAllCounts() {
    return this.http.get(this.common.rooturl + "/User/GetAllCounts");
  }
  // Get Pull Status
  GetPullStatus() {
    return this.http.get(this.common.rooturl + "/User/GetPullStatus");
  }

  // Download Images
  DownloadImages() {
    return this.http.get(this.common.rooturl + "/User/DownloadImages");
  }

  // Upload Images
  UploadImages() {
    return this.common.rooturl + "/ServerSync/UploadImages";
  }

  // Remove Images
  RemoveImages() {
    return this.common.rooturl + "/ServerSync/RemoveImages";
  }
  //getUserScreensPermissions
  getUserScreensPermissions() {
    return this.http.get(this.common.rooturl + "/User/GetUserScreensPermissions");
  }
  // Get All Branches
  GetAllBranches() {
    return this.http.get(this.common.rooturl + "/User/GetAllBranches");
  }
  // Update Default Branch
  UpdateDefaultBranch(databaseDetail: DatabaseDetailModel) {
    return this.http.post(this.common.rooturl + "/User/UpdateDefaultBranch", databaseDetail);
  }

  Getviewdata() {
    return this.http.get(this.common.rooturl + "/User/Getviewdata");
  }
  UserLogin(UserLogin: UserLoginModel) {
    return this.http.post(this.common.rooturl + "/UserLogin/InsertUserLogin", UserLogin);
  }

  AddFerbURL(URL: any) {
    return this.http.post(this.common.rooturl + "/User/AddFerbURL", URL);
  }

  pullFromServerInLogin() {
    return this.http.get(this.common.rooturl + "/ServerSync/pullFromServerInLogin");
  }
}
