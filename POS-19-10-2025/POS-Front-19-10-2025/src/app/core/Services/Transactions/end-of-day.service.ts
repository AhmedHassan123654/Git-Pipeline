import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SaleReportModel } from "../../Models/Reporting/sale-report-model";
import { CommonService } from "../Common/common.service";
import { formatDate } from "@angular/common";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";

@Injectable({
  providedIn: "root"
})
export class EndOfDayService {
  constructor(private http: HttpClient, private common: CommonService) {}

  GetAllBranches() {
    return this.http.get(this.common.rooturl + "/EndOfDayReport/GetAllBranches");
  }

  GetFinalReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetFinalReport/", SaleReportModel);
  }
  GetCanceledProductsReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetCanceledProductsReport/", SaleReportModel);
  }
  PrintCanceledProductsReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/PrintCanceledProductsReport/", SaleReportModel);
  }
  GetReturnOrderReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetReturnOrderReport/", SaleReportModel);
  }
  GetDeletedOrders(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetDeletedOrders/", SaleReportModel);
  }
  PrintDeletedOrdersReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/PrintDeletedOrdersReport/", SaleReportModel);
  }
  GetShiftReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetShiftReport/", SaleReportModel);
  }
  PrintShiftReport(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/PrintShiftReport/", data);
  }
  PrintFirst(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/FinalReportPrint/", data);
  }
  GetUsersReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetUsersReport/", SaleReportModel);
  }
  GetGroupsReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetGroupsReport/", SaleReportModel);
  }
  GetOrderTypeReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetOrderTypeReport/", SaleReportModel);
  }
  PrintUsersReport(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/PrintUsersReport/", data);
  }
  PrintGroupsReport(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/PrintGroupsReport/", data);
  }
  GetProductGroupPrint(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetProductGroupPrint/", data);
  }
  PrintOrderType(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/PrintOrderType/", data);
  }
  GetOrderPayTypeReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetOrderPayTypeReport/", SaleReportModel);
  }
  PrintOrderPayType(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/PrintOrderPayType/", data);
  }
  GetOrderPointOfSaleReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetOrderPointOfSaleReport/", SaleReportModel);
  }
  PrintOrderPointOfSaleReport(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/PrintOrderPointOfSaleReport/", data);
  }
  GetSalesTargetDataReport(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetSalesTargetDataReport/", data);
  }
  GetProductItemsDataReport(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetProductItemsDataReport/", data);
  }
  PrintProductItemsReport(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/PrintProductItemsReport/", data);
  }
  PrintSalesTargetReport(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/PrintSalesTargetReport/", data);
  }
  GetNotClosedReport(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetNotClosedReport/", data);
  }
  GetProductQuantityReport(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/GetProductQuantityReport/", data);
  }
  PrintProductQuantityReport(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/PrintProductQuantityReport/", data);
  }
  PrintNotClosedReport(data: any) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/PrintNotClosedReport/", data);
  }
  PrintOrdersReport(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/PrintOrdersReport/", SaleReportModel);
  }
  sendmail(data) {
    return this.http.post(this.common.rooturl + "/EndOfDayReport/SendEmail", data);
  }

  public prepareReportLables(printDetailobj, responseobj, myjson) {
    const format = "dd/MM/yyyy";
    const locale = "en-US";
    let fromdata: string = "";
    let ToDate: string = "";
    let fromtime: string = "";
    let Totime: string = "";
    let DayName: string = "";
    if (responseobj != undefined && responseobj.FromDate != undefined) {
      fromdata = formatDate(responseobj.FromDate, format, locale);
    }
    if (responseobj != undefined && responseobj.ToDate != undefined) {
      ToDate = formatDate(responseobj.ToDate, format, locale);
    }
    if (responseobj != undefined && responseobj.FromTime != undefined) {
      fromtime = responseobj.FromTime.toString();
    }
    if (responseobj != undefined && responseobj.ToTime != undefined) {
      Totime = responseobj.ToTime.toString();
    }
    if (responseobj != undefined && responseobj.DayName != undefined) {
      DayName = responseobj.DayName.toString();
    }

    if (printDetailobj.LanguageId == 1) {
      myjson = en["Reports"];
      responseobj.Labels = myjson;
      responseobj.CurrentLang = "en";
      responseobj.ReportOptions =
        responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        responseobj.Labels["DayName"] +
        ":" +
        DayName;
    }
    if (printDetailobj.LanguageId == 2) {
      myjson = ar["Reports"];
      responseobj.Labels = myjson;
      responseobj.CurrentLang = "ar";
      responseobj.ReportOptions =
        responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        responseobj.Labels["DayName"] +
        ":" +
        DayName;
    }

    if (printDetailobj.LanguageId == 3) {
      myjson = tr["Reports"];
      responseobj.Labels = myjson;
      responseobj.CurrentLang = "en";
      responseobj.ReportOptions =
        responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        responseobj.Labels["DayName"] +
        ":" +
        DayName;
    }
    if (printDetailobj.LanguageId == 4) {
      myjson = fr["Reports"];
      responseobj.Labels = myjson;
      responseobj.CurrentLang = "en";
      responseobj.ReportOptions =
        responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        responseobj.Labels["DayName"] +
        ":" +
        DayName;
    }
  }
}
