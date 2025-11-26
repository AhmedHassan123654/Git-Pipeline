import { DriverModel } from "./../../Models/Transactions/DriverModel";
import { OrderModel } from "./../../Models/order/orderModel";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import "rxjs/add/operator/map";
import { AssignDriverModel } from "../../Models/Transactions/AssignDriverModel";

@Injectable({
  providedIn: "root"
})
export class AssignDriverService {
  constructor(private http: HttpClient, private common: CommonService) {}
  FirstOpen() {
    return this.http.get(this.common.rooturl + "/AssignDriver/FirstOpen");
  }
  GetOrderByDriverId(Id: string) {
    return this.http.get(this.common.rooturl + "/AssignDriver/GetOrderByDriverId/" + Id);
  }
  UpdateOrderAndDriver(assignDriver: AssignDriverModel) {
    return this.http.put(this.common.rooturl + "/AssignDriver/UpdateOrderAndDriver/", assignDriver);
  }
  UpdateDriver(driver: DriverModel) {
    return this.http.put(this.common.rooturl + "/AssignDriver/UpdateDriver", driver);
  }
}
