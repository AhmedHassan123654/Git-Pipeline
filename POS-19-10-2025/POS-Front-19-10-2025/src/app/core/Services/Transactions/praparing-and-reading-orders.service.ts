import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class PraparingAndReadingOrdersService {
  constructor(private http: HttpClient, private common: CommonService) {}

  GetPreparingOrders() {
    return this.http.get(this.common.rooturl + "/PreparingOrder/GetPreparingOrders");
  }
  GetReadyOrders() {
    return this.http.get(this.common.rooturl + "/ReadingOrder/GetReadyOrders");
  }
  GetReadyAndPreparingNumbers() {
    return this.http.get(this.common.rooturl + "/ReadingOrder/GetReadyAndPreparingNumbers");
  }
  UpdateReadyOrder(model: any) {
    return this.http.put(this.common.rooturl + "/ReadingOrder/UpdateReadyOrder/", model);
  }
  MoveToReady(model: any) {
    return this.http.put(this.common.rooturl + "/PreparingOrder/UpdateOrderToReadyAsync/", model);
  }
}
