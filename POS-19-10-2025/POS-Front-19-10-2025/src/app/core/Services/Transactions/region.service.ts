import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { RegionModel } from "../../Models/Transactions/region-model";
@Injectable({
  providedIn: "root"
})
export class RegionService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/Region/FirstOpen");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/Region/GetByDocumentID/" + DocumentId);
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Region/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Region/PreAddUpdate");
  }

  getGrideList() {
    return this.http.get(this.common.rooturl + "/Region/GetGrideList");
  }
  Transactions(Region: RegionModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Region/InsertRegionAsync/", Region);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Region/UpdateRegionrAsync/", Region);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Region/DeleteRegionAsync/" + Region.DocumentId);
    }
  }
}
