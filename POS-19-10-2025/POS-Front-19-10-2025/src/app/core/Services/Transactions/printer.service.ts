import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class PrinterService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/Printer/FirstOpen");
  }

  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/Printer/GetByDocumentID/" + DocumentId);
  }

  Transactions(printermodel: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Printer/PostPrinter/", printermodel);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Printer/PutPrinter/", printermodel);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Printer/DeletePrinter/" + printermodel.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Printer/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Printer/PreAddUpdate");
  }

  getGrideList() {
    return this.http.get(this.common.rooturl + "/Printer/GetGrideList");
  }
  GetPrinterdata(PrintDocmentId: string) {
    return this.http.get(this.common.rooturl + "/Printer/GetPrinterdata/" + PrintDocmentId);
  }
}
