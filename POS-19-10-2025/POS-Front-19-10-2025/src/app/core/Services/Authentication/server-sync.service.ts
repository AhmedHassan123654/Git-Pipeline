import { Injectable } from "@angular/core";
import { CommonService } from "../Common/common.service";
import { HttpClient } from "@angular/common/http";
import { DatabaseDetailModel } from "../../Models/Authentication/database-detail-model";

@Injectable({
  providedIn: "root"
})
export class ServerSyncService {
  constructor(private http: HttpClient, private common: CommonService) {}
  // Get
  severSyncUrl = this.common.rooturl.toString().replace("/api", "");

  Get() {
    return this.http.get(this.common.rooturl + "/ServerSync/GetServerSyncAsync");
  }
  GetCountsNotSync() {
    return this.http.get(this.common.rooturl + "/ServerSync/GetCountsNotSync");
  }
  GetSettings() {
    return this.http.get(this.common.rooturl + "/ServerSync/GetSettings");
  }
  TestConnection(databaseDetail: DatabaseDetailModel) {
    return this.http.post(this.common.rooturl + "/ServerSync/TestConnection", databaseDetail);
  }
  // PullFromServer
  PullFromServer(databaseDetail: DatabaseDetailModel) {
    
    if (databaseDetail.FinancialSystem == 2)
      return this.http.post(this.common.rooturl + "/Integration/PullFromServer", databaseDetail);
    else return this.http.post(this.common.rooturl + "/ServerSync/PullFromServer", databaseDetail);
  }
  pushInputsToOnlineOrder(POS:any) {
    
    return this.http.post(this.severSyncUrl + "/ServerSync/PushInputsToOnlineOrder",POS);
  }
  // pullProductsFromServer
  PullProductsFromServer(databaseDetail: DatabaseDetailModel) {
    if (databaseDetail.FinancialSystem == 2)
      return this.http.post(this.common.rooturl + "/Integration/GetProducts", databaseDetail);
    else return this.http.post(this.common.rooturl + "/ServerSync/GetProductTypesAsync", databaseDetail);
  }
  PullCustomersFromServer(databaseDetail: DatabaseDetailModel) {
    return this.http.post(this.common.rooturl + "/ServerSync/PullCustomersFromServer", databaseDetail);
  }
  // pullItemsFromServer
  PullItemsFromServer(databaseDetail: DatabaseDetailModel) {
    return this.http.post(this.common.rooturl + "/ServerSync/GetStocksTablesAsync", databaseDetail);
  }
  // PushFromServer
  PushToServer(databaseDetail: DatabaseDetailModel) {
    if (databaseDetail.FinancialSystem == 2)
      return this.http.post(this.common.rooturl + "/Integration/PushToServer", databaseDetail);
    else return this.http.post(this.common.rooturl + "/ServerSync/PushToServer", databaseDetail);
  }
  // Save
  SaveConnectionString(databaseDetail: DatabaseDetailModel) {
    return this.http.post(this.common.rooturl + "/ServerSync/SaveConnectionString", databaseDetail);
  }
  // UploadImages
  UploadImages() {
    return this.common.rooturl + "/ServerSync/UploadImages";
  }
  // RemoveImages
  RemoveImages() {
    return this.common.rooturl + "/ServerSync/RemoveImages";
  }
  // Download Images
  DownloadImages() {
    return this.http.get(this.common.rooturl + "/ServerSync/DownloadImages");
  }
  backup() {
    return this.http.get(this.common.rooturl + "/Backup/Backup");
  }

  DeleteOrdersAfterSync() {
    return this.http.delete(this.common.rooturl + "/ServerSync/DeleteOrdersAfterSync");
  }
}
