import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { CashReceiptModel } from "../../Models/Transactions/cash-receipt-model";
import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/map";
// import { readSync } from 'fs';
@Injectable({
  providedIn: "root"
})
export class CashreceiptService {
  constructor(private http: HttpClient, private common: CommonService) {}

  /* getAllData( state ?: any): Observable<any[]> {

  return this.http.get<any[]>(this.common.rooturl+'/CashReceipt/Pagination/'+state.action.currentPage+'/'+state.take)
    .map((response: any) => ({
      result:   response.Item1,
      count: response.Item2
    } as any))
    .map((data: any) => data);

} */
  firstOpen() {
    return this.http.get(this.common.rooturl + "/CashReceipt/FirstOpen");
  }
  cashFirstOpen() {
    return this.http.get(this.common.rooturl + "/CashReceipt/CashFirstOpen");
  }
  getCustomerBalance(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/Customer/GetCustomerBalance/" + DocumentId);
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/CashReceipt/GetByDocumentID/" + DocumentId);
  }
  /*  GetAllCashReceipts()
  {
    return this.http.get(this.common.rooturl+'/CashReceipt/GetAllCashReceipts');
  }
  GetAllCustomers(s:any,start :any,end :any)
  {
    return this.http.get(this.common.rooturl+'/CashReceipt/GetAllCustomers/'+s+'/'+start+'/'+end);
  } */
  Transactions(cashreceipt: CashReceiptModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/CashReceipt/PostCashReceipt/", cashreceipt);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/CashReceipt/PutCashReceipt/", cashreceipt);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/CashReceipt/DeleteCashReceipt/" + cashreceipt.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/CashReceipt/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/CashReceipt/PreAddUpdate");
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/CashReceipt/print/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/CashReceipt/GetGrideList");
  }
}
