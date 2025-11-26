import { HttpClient, CommonService } from "src/app/shared/Directives/pagetransactionsimport";

import { Injectable } from "@angular/core";
import { IntegrationSettingModel } from "../../Models/Transactions/integration-setting-model";
import { Observable } from "rxjs";
@Injectable({
  providedIn: "root"
})
export class IntegrationService {
  constructor(private http: HttpClient, private common: CommonService) {}

  GetAllMessages() {
    return this.http.get(this.common.rooturl + "/Integration/GetAllMessages");
  }
  updateOrderStatus(input) {
    return this.http.post(this.common.rooturl + "/Integration/UpdateOrderStatus", input);
  }

  assignToDriver(orderDocumentId: string, driverDocumentId: string) {
    return this.http.post(this.common.rooturl + "/Integration/AssignToDriver", { orderDocumentId, driverDocumentId });
  }

  GetMobileIntegrationSettings(): Observable<any> {
    return this.http.get(this.common.rooturl + "/Integration/GetAllIntegrationList");
  }
  insertDefaultWorkTime(){
    return this.http.get(this.common.rooturl + "/Integration/InsertDefaultWorkTime");
  }
}
