import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class ReturnInsuranseService {
  constructor(private http: HttpClient, private common: CommonService) {}
  FirstOpen() {
    return this.http.get(this.common.rooturl + "/ReturnInsurance/FirstOpenAsync");
  }
  GetAllOrdersWithInsurances() {
    return this.http.get(this.common.rooturl + "/ReturnInsurance/GetAllOrdersWithInsurances");
  }
  GetAllInsurances() {
    return this.http.get(this.common.rooturl + "/ReturnInsurance/GetAllInsurances");
  }
  GetSumOfReturnedQty(orderId: string, Id: string) {
    return this.http.get(this.common.rooturl + "/ReturnInsurance/GetSumOfReturnedQty/" + orderId + "/" + Id);
  }
  Save(model: any) {
    return this.http.post(this.common.rooturl + "/ReturnInsurance/InsertReturnedInsurance", model);
  }

  Transactions(returnInsurance: any, functiontype: string) {
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/ReturnInsurance/PutReturnOrder/", returnInsurance);
    }
  }
}
