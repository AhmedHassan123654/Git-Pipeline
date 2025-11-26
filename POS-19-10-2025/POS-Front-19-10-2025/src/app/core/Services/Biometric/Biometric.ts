import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class BiometricService {
  constructor(private http: HttpClient, private common: CommonService) {}
  GetBioConfigs(SearchDates: any = {}) {
    return this.http.get(this.common.rooturl + "/Biometric/GetBioConfigs");
  }
  GetAllEmployess() {
    return this.http.get(this.common.rooturl + "/Biometric/GetAllEmployess");
  }
  InsertBioConfig(BioConfig: any = {}) {
    return this.http.post(this.common.rooturl + "/Biometric/InsertBioConfig", BioConfig);
  }
  DeleteBioConfig(Id: string) {
    return this.http.delete(this.common.rooturl + "/Biometric/DeleteBioConfig/" + Id);
  }

  UpdateBioConfig(BioConfig: any = {}) {
    return this.http.put(this.common.rooturl + "/Biometric/UpdateBioConfig", BioConfig);
  }
  PingBiometricDevice(BioConfig: any = {}) {
    return this.http.post(this.common.rooturl + "/Biometric/PingBiometricDevice", BioConfig);
  }
  ConnectBiometricDevice(BioConfig: any = {}) {
    return this.http.post(this.common.rooturl + "/Biometric/ConnectBiometricDevice", BioConfig);
  }
  GetBiometricLogData(BioConfig: any = {}) {
    return this.http.post(this.common.rooturl + "/Biometric/GetBiometricLogData", BioConfig);
  }
  SaveBiometricLogData(Bios: any) {
    return this.http.post(this.common.rooturl + "/Biometric/InsertBios", Bios);
  }
}
