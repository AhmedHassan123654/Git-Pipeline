import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class SettingService {
  constructor(private http: HttpClient, private common: CommonService) {}

  //#region Settings

  GetSettings() {
    return this.http.get(this.common.rooturl + "/Setting/GetSettings");
  }
  GetSetting() {
    return this.http.get(this.common.rooturl + "/Setting/GetSetting");
  }
  GetTimeZoneList() {
    return this.http.get(this.common.rooturl + "/Setting/GetTimeZoneList");
  }
  GetLanguage() {
    return this.http.get(this.common.rooturl + "/Setting/GetLanguage");
  }
  SaveSettings(settings: any) {
    return this.http.post(this.common.rooturl + "/Setting/SaveSettings/", settings);
  }
  saveWhatsAppPath(settings: any) {
    return this.http.post(this.common.rooturl + "/Setting/SaveWhatsAppPath/", settings);
  }
  updateFirstLogIn(lang: string) {
    return this.http.get(this.common.rooturl + "/Setting/UpdateFirstLogIn/" + lang);
  }
  UpdateFinancialSystem(settings: any) {
    return this.http.get(this.common.rooturl + "/Setting/UpdateFinancialSystem/" + settings);
  }
  SaveSettingsfromLogin(settings: any) {
    return this.http.post(this.common.rooturl + "/Setting/SaveSettingsfromLogin/", settings);
  }
  SaveDefaultLanguage(lang: any) {
    return this.http.post(this.common.rooturl + "/Setting/SaveDefaultLanguage/", lang);
  }

  //#endregion

  //#region Printers
  GetNetworkPrinters() {
    return this.http.get(this.common.rooturl + "/Setting/GetNetworkPrinters");
  }
  GetServerPrinters() {
    return this.http.get(this.common.rooturl + "/Setting/GetServerPrinters");
  }
  Save(Printers: any) {
    return this.http.post(this.common.rooturl + "/Setting/SetKitchenPrinters/", Printers);
  }
  //#endregion
}
