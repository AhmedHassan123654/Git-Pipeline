import { Injectable } from "@angular/core";
import { CommonService, HttpClient } from "src/app/shared/Directives/pagetransactionsimport";
import { VolumeModel } from "../../Models/Transactions/volume-model";

@Injectable({
  providedIn: "root"
})
export class VolumeService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/Volume/FirstOpen");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/Volume/GetByDocumentID/" + DocumentId);
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Volume/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Volume/PreAddUpdate");
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/Volume/print/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/Volume/GetGrideList");
  }
  Transactions(volumeModel: VolumeModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Volume/InsertVolumeAsync/", volumeModel);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Volume/UpdateVolumeAsync/", volumeModel);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Volume/DeleteVolumeAsync/" + volumeModel.DocumentId);
    }
  }
}
