import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class StopProductsService {
  constructor(private http: HttpClient, private common: CommonService) {}
  FirstOpen() {
    return this.http.get(this.common.rooturl + "/StopProduct/FirstOpen");
  }
  GetStopDurationList() {
    return this.http.get(this.common.rooturl + "/StopProduct/GetStopDurationList");
  }
  UpdateproductProperties(products: any) {
    return this.http.post(this.common.rooturl + "/StopProduct/UpdateproductProperties/", products);
  }
}
