import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class TabelsHallService {
  constructor(private http: HttpClient, private common: CommonService) {}
  InsertHall(model: any) {
    return this.http.post(this.common.rooturl + "/Hall/InsertHall", model);
  }
  PrintTableQrCode(model: any) {
    return this.http.post(this.common.rooturl + "/Hall/PrintTableQrCode", model);
  }
  UpdateHall(model: any) {
    return this.http.put(this.common.rooturl + "/Hall/UpdateHall", model);
  }
  DeleteHall(Id: any) {
    return this.http.delete(this.common.rooturl + "/Hall/DeleteHall/" + Id);
  }
  GetAllHalls() {
    return this.http.get(this.common.rooturl + "/Hall/GetAllHalls");
  }
  GetHallsForOrder() {
    return this.http.get(this.common.rooturl + "/Order/GetHallsForOrder");
  }
  GetAllPricingClasses() {
    return this.http.get(this.common.rooturl + "/Hall/GetAllPricingClasses");
  }

  //#region Tables
  GetAllTables() {
    return this.http.get(this.common.rooturl + "/Table/GetAllTables");
  }
  //#endregion
}
