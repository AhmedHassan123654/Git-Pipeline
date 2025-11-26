import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class UploadService {
  constructor(private http: HttpClient) {}

  getExcel(): Observable<any> {
    return this.http.get("assets/excel/news.xlsx", {
      responseType: "arraybuffer"
    });
  }
}
