import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
import { ItemTransferRequestModel } from "../../Models/Transactions/ItemTransferRequestModel";

@Injectable({
  providedIn: "root"
})
export class ItemtransferrequestService {
  constructor(private http: HttpClient, private common: CommonService) {}

  getAllData(state?: any): Observable<any[]> {
    return this.http
      .get<any[]>(
        this.common.rooturl + "/ItemTransferRequest/Pagination/" + state.action.currentPage + "/" + state.take
      )
      .map(
        (response: any) =>
          ({
            result: response.Item1,
            count: response.Item2
          } as any)
      )
      .map((data: any) => data);
  }
  firstOpen() {
    return this.http.get(this.common.rooturl + "/ItemTransferRequest/FirstOpen");
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/ItemTransferRequest/PreAddUpdate");
  }
  GetAllItemTransferRequests() {
    return this.http.get(this.common.rooturl + "/ItemTransferRequest/GetAllItemTransferRequests");
  }

  Transactions(itemtransferrequest: ItemTransferRequestModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/ItemTransferRequest/PostItemTransferRequest/", itemtransferrequest);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/ItemTransferRequest/PutItemTransferRequest/", itemtransferrequest);
    }
    if (functiontype == "Delete") {
      return this.http.delete(
        this.common.rooturl + "/ItemTransferRequest/DeleteItemTransferRequest/" + itemtransferrequest.DocumentId
      );
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/ItemTransferRequest/Pagination/" + pageNumber);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/ItemTransferRequest/GetGrideList");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/ItemTransferRequest/GetByDocumentId/" + DocumentId);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/ItemTransferRequest/print/", model);
  }
  addItemTransferRequestToFerpAsync(itemtransferrequest) {
    return this.http.post(
      this.common.rooturl + "/ItemTransferRequest/AddItemTransferRequestToFerpAsync/",
      itemtransferrequest
    );
  }
}
