import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CustomerOrderService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/CustomerOrders/FirstOpen");
  }
  customerOrderFirstOpen() {
    return this.http.get(this.common.rooturl + "/CustomerOrders/CustomerOrderFirstOpen");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/CustomerOrders/GetByDocumentID/" + DocumentID);
  }
  getTodaysCustomerOrders(tableId:string = null) {
    return this.http.get(this.common.rooturl + "/CustomerOrders/GetTodaysCustomerOrders/"+ (tableId??''));
  }
  getCustomerOrdersByCustomerId(customerId:string) {
    return this.http.get(this.common.rooturl + "/CustomerOrders/GetCustomerOrdersByCustomerId/"+ (customerId));
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/CustomerOrders/PreAddUpdateAsync");
  }
  updateMobileOrder(DocumentID: string){
    return this.http.get(this.common.rooturl + "/CustomerOrders/UpdateMobileOrder/"+ DocumentID);
  }
  Transactions(model: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/CustomerOrders/Insert", model);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/CustomerOrders/Update", model);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/CustomerOrders/Delete/" + model.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/CustomerOrders/Pagination/" + pageNumber);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/CustomerOrders/print/", model);
  }
  printAfterAdd(model: any) {
    return this.http.post(this.common.rooturl + "/CustomerOrders/printAfterAdd/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/CustomerOrders/GetGrideList");
  }

  getCustomerOrdersCount(): Observable<any> {
    return this.http.get(this.common.rooturl + "/Order/GetCustomerOrdersCount");
  }
}
