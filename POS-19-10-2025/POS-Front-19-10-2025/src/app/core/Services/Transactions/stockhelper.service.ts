import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class StockhelperService {
  constructor(private http: HttpClient, private common: CommonService) {}
  public getAvailableQuantity(model: any): Observable<any> {
    return this.http.post(this.common.rooturl + "/StockHelper/GetAvailableQuantity/", model);
  }
  public getItemDocumentId(itemId: Number, itemList: any[]) {
    const itemDocumentId = itemList.filter((x) => x.Id == itemId).map((t) => t.DocumentId)[0];
    return itemDocumentId;
  }
  public getUnitDocumentId(unitId: Number, unitList: any[]) {
    const unitDocumentId = unitList.filter((x) => x.Id == unitId).map((t) => t.DocumentId)[0];
    return unitDocumentId;
  }
  public getCostCenterDocumentId(costCenterId: Number, costCenterList: any[]) {
    const costCenterDocumentId = costCenterList.filter((x) => x.Id == costCenterId).map((t) => t.DocumentId)[0];
    return costCenterDocumentId;
  }
}
