import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { ProfileModel } from "../../Models/Authentication/profile-model";
import { GradientConfig } from "src/app/app-config";
// import { GradientConfig } from 'src/app/app-config';

@Injectable({
  providedIn: "root"
})
export class UserProfileServiceService {
  constructor(private http: HttpClient, private common: CommonService) {}
  //Functions
  GetUserInfo() {
    return this.http.get(this.common.rooturl + "/User/GetUserInfo");
  }

  UpdateUserInfo(userprofile: ProfileModel) {
    return this.http.put(this.common.rooturl + "/User/UpdateUserInfo", userprofile);
  }
  UpdateUserStyle(model: GradientConfig) {
    return this.http.put(this.common.rooturl + "/User/UpdateUserStyle", model);
  }
}
