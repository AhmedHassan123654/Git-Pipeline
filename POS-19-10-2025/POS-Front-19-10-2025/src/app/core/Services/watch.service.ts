import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { CommonService } from "./Common/common.service";

@Injectable({
  providedIn: "root"
})
export class WatchService {
  constructor(private http: HttpClient, private common: CommonService) {}

  getWatch(): Observable<Date> {
    return this.http.get<Date>(this.common.rooturl + "");
  }
}
