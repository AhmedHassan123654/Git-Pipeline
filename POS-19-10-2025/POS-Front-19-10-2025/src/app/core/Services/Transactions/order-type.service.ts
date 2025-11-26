import { Injectable } from "@angular/core";
import { CommonService, HttpClient } from "src/app/shared/Directives/pagetransactionsimport";
import { OrderTypeModel } from "../../Models/Transactions/order-type-model";

@Injectable({
  providedIn: "root"
})
export class OrderTypeService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/OrderType/FirstOpen");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/OrderType/GetByDocumentID/" + DocumentID);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/OrderType/PreAddUpdate");
  }

  Transactions(OrderType: OrderTypeModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/OrderType/PostOrderType", OrderType);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/OrderType/PutOrderType", OrderType);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/OrderType/DeleteOrderType/" + OrderType.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/OrderType/Pagination/" + pageNumber);
  }

  getGrideList() {
    return this.http.get(this.common.rooturl + "/OrderType/GetGrideList");
  }
  GetOrderTypeTaxes() {
    return this.http.get(this.common.rooturl + "/OrderType/GetOrderTypeTaxes");
  }
  GetAllprinters() {
    return this.http.get(this.common.rooturl + "/OrderType/GetPrinters");
  }
}
