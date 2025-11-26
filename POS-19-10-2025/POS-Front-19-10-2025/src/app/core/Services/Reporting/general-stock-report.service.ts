import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class GeneralStockReportService {
  constructor(private http: HttpClient, private common: CommonService) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  firstOpen() {
    return this.http.get(this.common.rooturl + "/StocksReports/FirstOpen");
  }
  printReport(reportOptions: any) {
    return this.http.post(this.common.rooturl + "/StocksReports/PrintReport/", reportOptions);
  }
}
