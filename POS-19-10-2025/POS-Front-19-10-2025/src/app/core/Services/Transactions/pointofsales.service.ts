import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { DataStateChangeEventArgs } from "@syncfusion/ej2-angular-grids";
import { Observable } from "rxjs";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/map";
import { PointOfSaleModel } from "../../Models/Transactions/point-of-sale-model";

@Injectable({
  providedIn: "root"
})
export class PointOfSalesService {
  constructor(private http: HttpClient, private common: CommonService) {}

  /* getAllData( state ?: any): Observable<any[]> {

  return this.http.get<any[]>(this.common.rooturl+'/PointOfSale/Pagination/'+state.action.currentPage+'/'+state.take)
    .map((response: any) => ({
      result:   response.Item1,
      count: response.Item2
    } as any))
    .map((data: any) => data);

} */
  firstOpen() {
    return this.http.get(this.common.rooturl + "/PointOfSale/FirstOpen");
  }
  PointOfSaleFirstOpen() {
    return this.http.get(this.common.rooturl + "/PointOfSale/PointOfSaleFirstOpen");
  }
  getAuthorizedPOSForOldUsers() {
    return this.http.get(this.common.rooturl + "/PointOfSale/GetAuthorizedPOSForOldUsers");
  }
  getAuthorizedPOS() {
    return this.http.get(this.common.rooturl + "/PointOfSale/GetAuthorizedPOS");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/PointOfSale/GetByDocumentID/" + DocumentID);
  }
  /*   GetAllPointOfSales()
  {
    return this.http.get(this.common.rooturl+'/PointOfSale/GetAllPointOfSales');
  } */
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/PointOfSale/Pagination/" + pageNumber);
  }
  Transactions(pointOfSale: PointOfSaleModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/PointOfSale/InsertPointOfSale", pointOfSale);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/PointOfSale/UpdatePointOfSale", pointOfSale);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/PointOfSale/DeletePointOfSale/" + pointOfSale.DocumentId);
    }
  }
  AuthorizeDevice(pointOfSale: any) {
    return this.http.post(this.common.rooturl + "/PointOfSale/AuthorizeDevice", pointOfSale);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/PointOfSale/PreAddUpdateAsync");
  }
  removePushServiceLinks() {
    return this.http.put(this.common.rooturl + "/PointOfSale/RemovePushServiceLinks",null);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/PointOfSale/print/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/PointOfSale/GetGrideList");
  }
  GetOrderTypes() {
    return this.http.get(this.common.rooturl + "/PointOfSale/GetOrderTypes");
  }
  insertDefaultPointOfSale() {
    return this.http.get(this.common.rooturl + "/PointOfSale/InsertDefaultPointOfSale");
  }
}
