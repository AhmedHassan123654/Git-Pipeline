import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import "rxjs/add/operator/map";
import { WorktimesModel } from "../../Models/Transactions/worktimesModel";
@Injectable({
  providedIn: "root"
})
export class ShiftsService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/WorkShift/FirstOpen");
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/WorkShift/print/", model);
  }
  GetAllShifts() {
    return this.http.get(this.common.rooturl + "/WorkShift/GetAllWorkShifts");
  }
  GetAllCachiers() {
    /*  return this.http.get(this.common.rooturl+'/UserDetails/GetAllUserDetails'); */
    return this.http.get(this.common.rooturl + "/User/GetAllUsersInfo");
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/WorkShift/PreAddUpdate");
  }
  Transactions(shift: WorktimesModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/WorkShift/PostWorkShift/", shift);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/WorkShift/PutWorkShift/", shift);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/WorkShift/DeleteWorkShift/" + shift.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/WorkShift/Pagination/" + pageNumber);
  }
  GetScreen() {
    return this.http.get(this.common.rooturl + "/Screen/GetScreen");
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/WorkShift/GetGrideList");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/WorkShift/GetByDocumentID/" + DocumentId);
  }
}
