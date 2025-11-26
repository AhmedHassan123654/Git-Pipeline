import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { OrderModel } from "src/app/Features/return-order/return-order-imports";
import { SaleReportModel } from "../../Models/Reporting/sale-report-model";

@Injectable({
  providedIn: "root"
})
export class FollowOrdersService {
  constructor(private http: HttpClient, private common: CommonService) {}
  GetAssginDriverList() {
    return this.http.get(this.common.rooturl + "/FollowOrders/GetAssginDriverList");
  }
  GetFollowOrderSetting() {
    return this.http.get(this.common.rooturl + "/FollowOrders/GetFollowOrderSetting");
  }
  GetBackDriverList() {
    return this.http.get(this.common.rooturl + "/FollowOrders/GetBackDriverList");
  }
  GetByDocumentID(documentId : string) {
    return this.http.get(this.common.rooturl + "/FollowOrders/GetByDocumentID"+ documentId);
  }
  GetPaymentTypeList() {
    return this.http.get(this.common.rooturl + "/FollowOrders/GetPaymentTypeList");
  }
  GetCustomerList() {
    return this.http.get(this.common.rooturl + "/FollowOrders/GetCustomerList");
  }
  GetDriverList() {
    return this.http.get(this.common.rooturl + "/FollowOrders/GetDriverList");
  }
  GetAllOrdersNotPaidDriver() {
    return this.http.get(this.common.rooturl + "/FollowOrders/GetAllOrdersNotPaidDriver");
  }
  GetGrideOrdersList(data: any) {
    return this.http.post(this.common.rooturl + "/FollowOrders/GetGrideOrdersList/", data);
  }
  UpdateOrder(orders: OrderModel[]) {
    return this.http.put(this.common.rooturl + "/FollowOrders/PutOrder/", orders);
  }
  DriverPaidAsync(orders: OrderModel[]) {
    return this.http.put(this.common.rooturl + "/FollowOrders/DriverPaidAsync/", orders);
  }
  UpdatePaidOrderAsync(orders: OrderModel[]) {
    return this.http.put(this.common.rooturl + "/FollowOrders/UpdatePaidOrderAsync/", orders);
  }
  UpdateOrderByDriverID(data: any) {
    return this.http.put(this.common.rooturl + "/FollowOrders/UpdateOrderByDriverID/", data);
  }
  SavePaymentOrder(data: any) {
    return this.http.put(this.common.rooturl + "/FollowOrders/SavePaymentOrder/", data);
  }
  GetAllOrdersByDateOrDriver(date: any) {
    return this.http.post(this.common.rooturl + "/FollowOrders/GetAllOrdersByDateOrDriver/", date);
  }
  getBranchdata() {
    return this.http.get(this.common.rooturl + "/FollowOrders/getBranchdata");
  }
  GetTotalDriverReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/FollowOrders/GetTotalDriverReport/", SaleReportModel);
  }
  GetDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/FollowOrders/GetDataReport/", SaleReportModel);
  }
  PrintDriverDetail(data: any) {
    return this.http.post(this.common.rooturl + "/FollowOrders/PrintDriverDetail/", data);
  }
  PrintDriversTotal(data: any) {
    return this.http.post(this.common.rooturl + "/FollowOrders/PrintDriversTotal/", data);
  }
  SaveFollowOrderSetting(FollowOrderSettingModel: any) {
    return this.http.post(this.common.rooturl + "/FollowOrders/SaveFollowOrderSettingAsync/", FollowOrderSettingModel);
  }
  PrintOrderWithPreview(documentId: string) {
    return this.http.get(this.common.rooturl + "/Order/PrintOrderWithPreview/" + documentId);
  }
  PrintPreviewOrder(order: OrderModel) {
    return this.http.post(this.common.rooturl + "/Order/PrintPreviewOrder/", order);
  }
}
