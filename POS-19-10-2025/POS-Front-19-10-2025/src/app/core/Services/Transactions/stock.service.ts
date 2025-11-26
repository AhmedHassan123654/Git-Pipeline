import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class StockService {
  constructor(private http: HttpClient, private common: CommonService) {}

  /*  getAllData(state?: any): Observable<any[]> {
    return this.http
      .get<any[]>(
        this.common.rooturl +
          "/Stock/Pagination/" +
          state.action.currentPage +
          "/" +
          state.take
      )
      .map(
        (response: any) =>
          ({
            result: response.Item1,
            count: response.Item2,
          } as any)
      )
      .map((data: any) => data);
  } */
  FirstOpen() {
    return this.http.get(this.common.rooturl + "/Stock/FirstOpen");
  }
  GetAllStocks() {
    return this.http.get(this.common.rooturl + "/Stock/GetAllStocks");
  }
  GetAllCustomers(s: any, start: any, end: any) {
    return this.http.get(this.common.rooturl + "/Stock/GetAllCustomers/" + s + "/" + start + "/" + end);
  }
  Transactions(stock: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Stock/PostStock/", stock);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Stock/PutStock/", stock);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Stock/DeleteStock/" + stock.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Stock/Pagination/" + pageNumber);
  }
}
