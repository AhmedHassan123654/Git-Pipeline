import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
@Injectable({
  providedIn: "root"
})
export class FollowCallCenterOrderService {
  constructor(private http: HttpClient, private common: CommonService) {}
  GetAllCustomers() {
    return this.http.get(this.common.rooturl + "/FollowCallCenterOrder/GetAllCustomers");
  }
  GetAllCallCenterOrders(Obj: any) {
    return this.http.post(this.common.rooturl + "/FollowCallCenterOrder/GetAllCallCenterOrders/", Obj);
  }
  SaveFollowOrderSetting(FollowOrderSettingModel: any) {
    return this.http.post(this.common.rooturl + "/FollowOrders/SaveFollowOrderSettingAsync/", FollowOrderSettingModel);
  }
  GetFollowOrderSetting() {
    return this.http.get(this.common.rooturl + "/FollowOrders/GetFollowOrderSetting");
  }
}
