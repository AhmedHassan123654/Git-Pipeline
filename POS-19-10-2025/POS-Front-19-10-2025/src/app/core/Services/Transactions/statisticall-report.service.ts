import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../Common/common.service";
import { SaleReportModel } from "../../Models/Reporting/sale-report-model";
@Injectable({
  providedIn: "root"
})
export class StatisticallReportService {
  constructor(private http: HttpClient, private common: CommonService) {}
  getAllUsersInfo() {
    return this.http.get(this.common.rooturl + "/User/GetAllUsersInfo");
  }
  GetAllBranches() {
    return this.http.get(this.common.rooturl + "/SalesReport/GetAllBranches");
  }
  GetAllTables() {
    return this.http.get(this.common.rooturl + "/SalesReport/GetAllTables");
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
  GetHourStatisticalReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/StatisticalReport/GetHourStatisticalReport/", SaleReportModel);
  }
  GetMonthStatisticalReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/StatisticalReport/GetMonthStatisticalReport/", SaleReportModel);
  }
  GetHourStatisticalChart(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/StatisticalReport/GetHourStatisticalChart/", SaleReportModel);
  }
  GetMonthStatisticalChart(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/StatisticalReport/GetMonthStatisticalChart/", SaleReportModel);
  }
  GetHourProductsStatisticalChart(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/StatisticalReport/GetHourProductsStatisticalChart/", SaleReportModel);
  }
  GetHourProductsStatisticalReport(SaleReportModel: SaleReportModel) {
    return this.http.post(
      this.common.rooturl + "/StatisticalReport/GetHourProductsStatisticalReport/",
      SaleReportModel
    );
  }
  GetOrderAndReturnOrderStatisticalReport(SaleReportModel: SaleReportModel) {
    return this.http.post(
      this.common.rooturl + "/StatisticalReport/GetOrderAndReturnOrderStatisticalReport/",
      SaleReportModel
    );
  }
  GetYearsList() {
    return this.http.get(this.common.rooturl + "/StatisticalReport/GetYearsList");
  }
}
