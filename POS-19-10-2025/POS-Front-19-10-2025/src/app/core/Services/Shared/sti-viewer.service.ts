import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { DataStateChangeEventArgs, Sorts, DataResult } from "@syncfusion/ej2-angular-grids";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/map";
@Injectable({
  providedIn: "root"
})
export class StiViewerService extends Subject<DataStateChangeEventArgs> {
  constructor(private http: HttpClient, private common: CommonService) {
    super();
  }
}
