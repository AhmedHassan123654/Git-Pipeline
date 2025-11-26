import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class OpenDayService {
  isOpened: boolean = true;

  constructor(private http: HttpClient, private common: CommonService) {}
  getGrideList() {
    return this.http.get(this.common.rooturl + "/OpenDay/GetGrideList");
  }
  firstOpen() {
    return this.http.get(this.common.rooturl + "/Dashboard/OpenDay");
  }
  CheckOpenDay() {
    return this.http.get(this.common.rooturl + "/Dashboard/CheckOpenDay");
  }
  AddOpenDay(openday: any) {
    this.isOpened = false;
    return this.http.post(this.common.rooturl + "/Dashboard/InsertOpenDay/", openday);
  }
  CloseDay(openday:any) {
    return this.http.post(this.common.rooturl + "/Dashboard/CloseDay/" , openday);
  }
  OpenDay(DocumentId: string) {
    this.isOpened = false;
    return this.http.get(this.common.rooturl + "/Dashboard/OpenDay/" + DocumentId);
  }
}
