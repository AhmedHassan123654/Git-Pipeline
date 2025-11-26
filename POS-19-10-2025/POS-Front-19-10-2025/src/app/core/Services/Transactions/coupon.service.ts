import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../Common/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CouponService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/Coupons/FirstOpen");
  }
  CouponsFirstOpenAsync() {
    return this.http.get(this.common.rooturl + "/Coupons/CouponsFirstOpenAsync");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/Coupons/GetByDocumentID/" + DocumentId);
  }

  Transactions(Model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Coupons/Insert/", Model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Coupons/Update/", Model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Coupons/Delete/" + Model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Coupons/Pagination/" + pageNumber);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/Coupons/print/", model);
  }

  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Coupons/PreAddUpdate");
  }
  /*  print(model:any)
  {
    return this.http.post(this.common.rooturl+'/MinimumCharge/print/',model);
  } */
  printAfterAdd(model: any) {
    return this.http.post(this.common.rooturl + "/Coupons/printAfterAdd/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/Coupons/GetGrideList");
  }

  CheckCouponValidate(model: any): Observable<any> {
    return this.http.post(this.common.rooturl + "/Coupons/CheckCouponValidate", model);
  }
}
