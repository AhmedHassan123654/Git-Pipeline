import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import "rxjs/add/operator/map";
@Injectable({
  providedIn: "root"
})
export class ReceivingtransferService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/ReceivingTransfer/FirstOpen");
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/ReceivingTransfer/PreAddUpdate");
  }
  getAllReceivingTransfers() {
    return this.http.get(this.common.rooturl + "/ReceivingTransfer/GetAllReceivingTransfers");
  }
  getServerTransferCount(stockId: any) {
    return this.http.get(this.common.rooturl + "/ReceivingTransfer/GetServerTransferCount/" + stockId);
  }
  getServerTransfers() {
    return this.http.get(this.common.rooturl + "/ReceivingTransfer/GetServerTransfers");
  }
  Transactions(receivingtransfer: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/ReceivingTransfer/PostReceivingTransfer/", receivingtransfer);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/ReceivingTransfer/PutReceivingTransfer/", receivingtransfer);
    }
    if (functiontype == "Delete") {
      return this.http.delete(
        this.common.rooturl + "/ReceivingTransfer/DeleteReceivingTransfer/" + receivingtransfer.DocumentId
      );
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/ReceivingTransfer/Pagination/" + pageNumber);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/ReceivingTransfer/GetGrideList");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/ReceivingTransfer/GetByDocumentId/" + DocumentId);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/ReceivingTransfer/print/", model);
  }
  autoInsertReceivingTransfer() {
    return this.http.get(this.common.rooturl + "/ReceivingTransfer/AutoInsertReceivingTransferAsync");
  }
}
