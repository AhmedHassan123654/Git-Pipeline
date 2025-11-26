import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class TaxAuthorityService {
  constructor(private http: HttpClient, private common: CommonService) {}
  FirstOpen() {
    return this.http.get(this.common.rooturl + "/TaxAuthority/FirstOpen");
  }
  GetNonSyncedTaxOrders(model) {
    return this.http.post(this.common.rooturl + "/TaxAuthority/GetNonSyncedTaxOrders/", model);
  }
  GetNonSyncedTaxRTOrders(model) {
    return this.http.post(this.common.rooturl + "/TaxAuthority/GetNonSyncedTaxRTOrders/", model);
  }
  SyncOrdersToTaxAuthority(model) {
    return this.http.post(this.common.rooturl + "/TaxAuthority/SyncOrdersToTaxAuthority/", model);
  }
  SyncRTOrdersToTaxAuthority(model) {
    return this.http.post(this.common.rooturl + "/TaxAuthority/SyncRTOrdersToTaxAuthority/", model);
  }
  updateSubmissionStatues(model) {
    return this.http.post(this.common.rooturl + "/TaxAuthority/UpdateSubmissionStatues/", model);
  }
  deleteSyncedOrders(model) {
    return this.http.post(this.common.rooturl + "/TaxAuthority/DeleteSyncedOrders/", model);
  }
  registerBranch(branchDocId:string, solutionUnitOtp:string) {
    return this.http.get(`${this.common.rooturl}/TaxAuthority/RegisterBranch/${branchDocId}/${solutionUnitOtp}`);
  }
}
