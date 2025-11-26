import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { SaleReportModel } from "../../Models/Reporting/sale-report-model";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";

@Injectable({
  providedIn: "root"
})
export class SalesReportService {
  constructor(private http: HttpClient, private common: CommonService) {}

  GetAllBranches() {
    return this.http.get(this.common.rooturl + "/SalesReport/GetAllBranches");
  }
  GetAllTables() {
    return this.http.get(this.common.rooturl + "/SalesReport/GetAllTables");
  }
  GetAllHalls() {
    return this.http.get(this.common.rooturl + "/SalesReport/GetAllHalls");
  }

  GetAllOrderTypes() {
    return this.http.get(this.common.rooturl + "/SalesReport/GetAllOrderTypes");
  }

  GetAllPaymentTypes() {
    return this.http.get(this.common.rooturl + "/SalesReport/GetAllPaymentTypes");
  }
  GetAllPOS() {
    return this.http.get(this.common.rooturl + "/SalesReport/GetAllPOS");
  }

  GetDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetDataReport/", SaleReportModel);
  }
  GetNetSalseReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetNetSalseReport/", SaleReportModel);
  }
  GetEmpsReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetEmpsReport/", SaleReportModel);
  }
  GetTotalsReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetTotalsReport/", SaleReportModel);
  }
  GetTotals(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetTotals/", SaleReportModel);
  }
  GetCreditDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetCreditDataReport/", SaleReportModel);
  }
  GetOnlineCompaniesDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetOnlineCompaniesDataReport/", SaleReportModel);
  }
  GetDeletedOrdersReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetDeletedOrdersReport/", SaleReportModel);
  }
  GetProductDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetProductDataReport/", SaleReportModel);
  }
  GetInsuranceDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetInsuranceDataReport/", SaleReportModel);
  }
  GetProductGroupDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetProductGroupDataReport/", SaleReportModel);
  }
  GetDateDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetDateDataReport/", SaleReportModel);
  }
  getTipsDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetTipsDataReport/", SaleReportModel);
  }
  GetOrderTypeDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetOrderTypeDataReport/", SaleReportModel);
  }
  GetOrderPayTypeDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetOrderPayTypeDataReport/", SaleReportModel);
  }
  GetPosDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetPosDataReport/", SaleReportModel);
  }
  GetDailyStockDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetDailyStockDataReport/", SaleReportModel);
  }
  GetCaptainDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetCaptainDataReport/", SaleReportModel);
  }
  GetWaiterDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetWaiterDataReport/", SaleReportModel);
  }
  GetCustomerOrdersDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetCustomerOrdersDataReport/", SaleReportModel);
  }
  GetHallDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetHallDataReport/", SaleReportModel);
  }
  GetTableDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetTableDataReport/", SaleReportModel);
  }
  GetUserDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetUserDataReport/", SaleReportModel);
  }
  GetProductTypeDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetProductTypeDataReport/", SaleReportModel);
  }
  GetProductsubItemDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetProductsubItemDataReport/", SaleReportModel);
  }
  GetProductItemsDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetProductItemsDataReport/", SaleReportModel);
  }
  GetTransferdOrders(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetTransferdOrders/", SaleReportModel);
  }
  GetDiscountedOrdersReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetDiscountedOrdersReport/", SaleReportModel);
  }
  PrintDiscountedOrdersReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintDiscountedOrdersReport/", SaleReportModel);
  }
  GetCustomerDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetCustomerDataReport/", SaleReportModel);
  }
  GetTotalNetSalesDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetTotalNetSalesDataReport/", SaleReportModel);
  }
  GetTaxDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetTaxDataReport/", SaleReportModel);
  }
  PrintTransferdOrdersReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintTransferdOrdersReport/", SaleReportModel);
  }
  PrintExtraExpensesReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintExtraExpensesReport/", SaleReportModel);
  }
  PrintPosDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintPosDataReport/", SaleReportModel);
  }
  PrintCancelledOrdersReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintCancelledOrdersReport/", SaleReportModel);
  }
  PrintTaxesReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintTaxesReport/", SaleReportModel);
  }
  PrintTotalsReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintTotals/", SaleReportModel);
  }
  PrintCreditDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintCreditDataReport/", SaleReportModel);
  }
  PrintNetSalesReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintNetSalesReport/", SaleReportModel);
  }
  PrintCustomerCreditReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintCustomerCreditReport/", SaleReportModel);
  }
  PrintOnlineCompanyDetailsReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintOnlineCompanyDetailsReport/", SaleReportModel);
  }
  PrintOnlineCompaniesReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintOnlineCompaniesReport/", SaleReportModel);
  }
  PrintDialyStockDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintDialyStockDataReport/", SaleReportModel);
  }
  PrintCaptainDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintCaptainDataReport/", SaleReportModel);
  }
  PrintCaptainDetailedDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintCaptainDetailedDataReport/", SaleReportModel);
  }
  PrintWaiterDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintWaiterDataReport/", SaleReportModel);
  }
  PrintInsuranceDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintInsuranceDataReport/", SaleReportModel);
  }
  PrintCustomerOrdersDetailsDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintCustomerOrdersDetailsDataReport/", SaleReportModel);
  }
  PrintCustomerOrdersDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintCustomerOrdersDataReport/", SaleReportModel);
  }
  PrintProductMovementsDataReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintProductMovementsDataReport/", SaleReportModel);
  }
  GetReturnOrderReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetReturnOrderReport/", SaleReportModel);
  }
  PrintPreviewReturnOrder(model: any) {
    return this.http.post(this.common.rooturl + "/ReturnOrder/print/", model);
  }
  PrintOrdersReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintOrdersReport/", SaleReportModel);
  }
  PrintDeletedOrdersReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintDeletedOrdersReport/", SaleReportModel);
  }
  PrintReturnOrdersReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintReturnOrdersReport/", SaleReportModel);
  }
  printProductReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/printProductReport/", SaleReportModel);
  }
  PrintProductGroupProductsReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintProductGroupProductsReport/", SaleReportModel);
  }
  PrintProductGroupOrdersReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintProductGroupOrdersReport/", SaleReportModel);
  }
  PrintDateReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintDateReport/", SaleReportModel);
  }
  PrintOrderTypeReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintOrderTypeReport/", SaleReportModel);
  }
  printOrderPayTypeReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/printOrderPayTypeReport/", SaleReportModel);
  }
  PrintUserReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintUserReport/", SaleReportModel);
  }
  PrintProductTypeReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintProductTypeReport/", SaleReportModel);
  }
  PrintCustomerReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintCustomerReport/", SaleReportModel);
  }
  GetCanceledProductsReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetCanceledProductsReport/", SaleReportModel);
  }
  GetEmployeeFeedingReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetEmployeeFeedingReport/", SaleReportModel);
  }
  PrintEmployeeFeeding(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintEmployeeFeeding/", SaleReportModel);
  }
  GetCustomerComplaintReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetCustomerComplaintReport/", SaleReportModel);
  }

  PrintCustomerComplaint(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/PrintCustomerComplaint/", SaleReportModel);
  }
  /*  GetOrderPayTypeReport(SaleReportModel:SaleReportModel ){
    return this.http.post(this.common.rooturl+'/SalesReport/GetOrderPayTypeReport/',SaleReportModel);
  }
  GetOrderPayTypeReport(SaleReportModel:SaleReportModel ){
    return this.http.post(this.common.rooturl+'/SalesReport/GetOrderPayTypeReport/',SaleReportModel);
  } */

  
  GetExtraExpensesReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/SalesReport/GetExtraExpensesReport/", SaleReportModel);
  }
  GetUserReportsPermission() {
    return this.http.get(this.common.rooturl + "/SalesReport/GetUserWithPermission");
  }
  public prepareDetailsReportLables(printDetailobj, model,documentId, myjson,ifPerview) {
    if (printDetailobj.LanguageId == 1) {
      model.push(documentId);
      myjson = en["Reports"];
      model.push(myjson);
      model.push("en");
    }
    if (printDetailobj.LanguageId == 2) {
      model.push(documentId);
      myjson = ar["Reports"];
      model.push(myjson);
      model.push("ar");
    }
    if (printDetailobj.LanguageId == 3) {
      model.push(documentId);
      myjson = tr["Reports"];
      model.push(myjson);
      model.push("en");
    }
    if (printDetailobj.LanguageId == 4) {
      model.push(documentId);
      myjson = fr["Reports"];
      model.push(myjson);
      model.push("en");
    }
    model.push(printDetailobj.PrintModelId);
    model.push(printDetailobj.DestinationId);
    model.push(printDetailobj.FileFormatId);

    if (printDetailobj.DestinationId == 2) {
      model.push(printDetailobj.Reciever);
      model.push(printDetailobj.Title);
      model.push(printDetailobj.Message);
      ifPerview = false;
    } else {
      ifPerview = true;
    }
  }
}
