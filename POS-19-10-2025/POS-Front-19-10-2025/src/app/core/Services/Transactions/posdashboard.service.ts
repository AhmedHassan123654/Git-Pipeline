import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../Common/common.service";
import { SaleReportModel } from "../../Models/Reporting/sale-report-model";

@Injectable({
  providedIn: "root"
})
export class POSDashboardService {
  constructor(private http: HttpClient, private common: CommonService) { }
  FirstOpen(SaleReportModel: SaleReportModel) {
    return this.http.post(this.common.rooturl + "/POSDashboard/FirstOpen", SaleReportModel);
  }
}
