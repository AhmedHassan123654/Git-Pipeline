import { DriverModel } from "src/app/core/Models/Transactions/DriverModel";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { Observable } from "rxjs";
import "rxjs/add/operator/map";

@Injectable({
  providedIn: "root"
})
export class DriverService {
  constructor(private http: HttpClient, private common: CommonService) {}

  /* getAllData( state ?: any): Observable<any[]> {

  return this.http.get<any[]>(this.common.rooturl+'/Driver/Pagination/'+state.action.currentPage+'/'+state.take)
    .map((response: any) => ({
      result:   response.Item1,
      count: response.Item2
    } as any))
    .map((data: any) => data);

} */
  firstOpen() {
    return this.http.get(this.common.rooturl + "/Driver/FirstOpen");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/Driver/GetByDocumentID/" + DocumentID);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Driver/PreAddUpdateAsync");
  }
  getAllDrivers() {
    return this.http.get(this.common.rooturl + "/Driver/GetAllDrivers");
  }
  getDriversByName(name) {
    return this.http.get(this.common.rooturl + "/Driver/GetDriversByName/" + name);
  }
  /*   GetDriverByPhone(phone:string)
  {
    return this.http.get(this.common.rooturl+'/Driver/GetDriverByPhone/'+phone);
  } */
  Transactions(driver: DriverModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Driver/InsertDriver", driver);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Driver/UpdateDriver", driver);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Driver/DeleteDriver/" + driver.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Driver/Pagination/" + pageNumber);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/Driver/print/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/Driver/GetGrideList");
  }
}
