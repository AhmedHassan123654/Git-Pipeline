import { Injectable } from "@angular/core";
import { ReturnOrderModel } from "../../Models/order/returnOrderModel";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class ApprovedReturnOrderService {
  constructor(private http: HttpClient, private common: CommonService) {}
  GetReturnOrderEnumList() {
    return this.http.get(this.common.rooturl + "/ApprovedReturnOrder/GetReturnOrderEnumList");
  }
  GetNotApprovedReturns() {
    return this.http.get(this.common.rooturl + "/ApprovedReturnOrder/GetNotApprovedReturns");
  }
  UpdateReturnOrder(Returns: ReturnOrderModel[]) {
    return this.http.put(this.common.rooturl + "/ApprovedReturnOrder/UpdateReturnOrder/", Returns);
  }
}
