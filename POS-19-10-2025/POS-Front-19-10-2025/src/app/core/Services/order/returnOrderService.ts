import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { ReturnOrderModel } from "../../Models/order/returnOrderModel";
import { PopUpReturnOrderFiltterModel } from "../../Models/order/pop-up-return-order-filtter-model";
//import { OrderModel } from '../../Models/order/orderModel';

@Injectable({
  providedIn: "root"
})
export class ReturnOrderService {
  pinUserId: string = '';
  get PinSuffix(): string {
    return this.pinUserId ? `?PinUserId=${this.pinUserId}` : '';
  }
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/ReturnOrder/FirstOpen" + this.PinSuffix);
  }
  GetCustomerList() {
    return this.http.get(this.common.rooturl + "/FollowOrders/GetCustomerList" + this.PinSuffix);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/ReturnOrder/print/" + this.PinSuffix, model);
  }
  printAfterAdd(model: any) {
    return this.http.post(this.common.rooturl + "/ReturnOrder/printAfterAdd" + this.PinSuffix, model);
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/ReturnOrder/GetByDocumentID/" + DocumentID + this.PinSuffix);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/ReturnOrder/GetGrideList" + this.PinSuffix);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/ReturnOrder/PreAddUpdate" + this.PinSuffix);
  }
  GetPaymentTypeList() {
    return this.http.get(this.common.rooturl + "/FollowOrders/GetPaymentTypeList" + this.PinSuffix);
  }
  GetAllpayTypeName() {
    return this.http.get(this.common.rooturl + "/ReturnOrder/GetAllpayTypeName" + this.PinSuffix);
  }
  Asyncdata(returnOrder: ReturnOrderModel) {
    return this.http.post(this.common.rooturl + "/ReturnOrder/Asyncdata" + this.PinSuffix, returnOrder);
  }
  GetAllOrdersbyDateAndUser(order: PopUpReturnOrderFiltterModel) {
    return this.http.post(this.common.rooturl + "/ReturnOrder/GetAllOrdersbyDateAndUser" + this.PinSuffix, order);
  }
  GetthisOrderData(orderID: string) {
    return this.http.get(this.common.rooturl + "/ReturnOrder/GetOrderData/" + orderID + this.PinSuffix);
  }
  getSelectedOrdersData(orderDocIds: string[]) {
    return this.http.post(this.common.rooturl + "/ReturnOrder/GetSelectedOrdersData" + this.PinSuffix, orderDocIds);
  }
  GetOrderDetails(orderID: string) {
    return this.http.get(this.common.rooturl + "/ReturnOrder/GetOrderDetails/" + orderID + this.PinSuffix);
  }
  GetAllOrders(date: Date) {
    return this.http.get(this.common.rooturl + "/ReturnOrder/GetAllOrders/" + date + this.PinSuffix);
  }
  GetAllReturnOrders() {
    return this.http.get(this.common.rooturl + "/ReturnOrder/GetAllReturnOrders" + this.PinSuffix);
  }
  Transactions(returnOrder: ReturnOrderModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/ReturnOrder/PostReturnOrder" + this.PinSuffix, returnOrder);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/ReturnOrder/PutReturnOrder" + this.PinSuffix, returnOrder);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/ReturnOrder/DeleteReturnOrder/" + returnOrder.DocumentId + this.PinSuffix);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/ReturnOrder/Pagination/" + pageNumber + this.PinSuffix);
  }
  //  //Functions
  //  GetAllOrders(){
  //     return this.http.get<Array<OrderModel>>(this.common.rooturl+'/ReturnOrder/GetAllOrders');
  //   }
  //  //Functions
  //  Insert(returnOrderModel:ReturnOrderModel){
  //   return this.http.post(this.common.rooturl+'/ReturnOrder/InsertReturnOrder',returnOrderModel);
  // }
}
