import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class IncomingService {
  constructor(private http: HttpClient, private common: CommonService) {}

  /*  getAllData(state?: any): Observable<any[]> {
    return this.http
      .get<any[]>(
        this.common.rooturl +
          "/Incoming/Pagination/" +
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
  firstOpen() {
    return this.http.get(this.common.rooturl + "/Incoming/FirstOpen");
  }
  GetAllIncomings() {
    return this.http.get(this.common.rooturl + "/Incoming/GetAllIncomings");
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Incoming/PreAddUpdate");
  }
  Transactions(incoming: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Incoming/PostIncoming/", incoming);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Incoming/PutIncoming/", incoming);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Incoming/DeleteIncoming/" + incoming.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Incoming/Pagination/" + pageNumber);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/Incoming/GetGrideList");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/Incoming/GetByDocumentId/" + DocumentId);
  }
}
