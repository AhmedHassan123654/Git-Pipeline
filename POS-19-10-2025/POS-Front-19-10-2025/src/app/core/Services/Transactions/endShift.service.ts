import { Injectable } from "@angular/core";
import { CommonService } from "../Common/common.service";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root"
})
export class EndShiftService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen(model) {
    return this.http.post(this.common.rooturl + "/IncomingUser/FirstOpen", model);
  }
  SetDayOpend(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/IncomingUser/SetDayOpend/" + DocumentId);
  }
  PrintCashierEndShift(model: any) {
    return this.http.post(this.common.rooturl + "/IncomingUser/PrintCashierEndShift", model);
  }
  PrintCashierEndShiftFromHome(model: any) {
    return this.http.post(this.common.rooturl + "/IncomingUser/PrintCashierEndShiftFromHome", model);
  }
  GetCurrentIncomingUser(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/IncomingUser/GetCurrentIncomingUser/" + DocumentId);
  }
  UpdateIncomingUser(model: any) {
    return this.http.put(this.common.rooturl + "/IncomingUser/UpdateIncomingUser", model);
  }
}
