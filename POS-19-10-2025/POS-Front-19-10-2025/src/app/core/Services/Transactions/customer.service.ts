import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import "rxjs/add/operator/map";
import { CustomerModel } from "../../Models/Transactions/CustomerModel";

@Injectable({
  providedIn: "root"
})
export class CustomerService {
  constructor(private http: HttpClient, private common: CommonService) {}

  /* getAllData( state ?: any): Observable<any[]> {

  return this.http.get<any[]>(this.common.rooturl+'/Customer/Pagination/'+state.action.currentPage+'/'+state.take)
    .map((response: any) => ({
      result:   response.Item1,
      count: response.Item2
    } as any))
    .map((data: any) => data);

} */
  firstOpen() {
    return this.http.get(this.common.rooturl + "/Customer/FirstOpen");
  }
  getCreditCustomers() {
    return this.http.get(this.common.rooturl + "/Customer/GetCreditCustomersAsync");
  }
  /*  GetReportDesgin()
  {
    return this.http.get(this.common.rooturl+'/Customer/GetReportDesgin');
  } */
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/Customer/GetByDocumentID/" + DocumentID);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/Customer/print/", model);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/Customer/GetGrideList");
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Customer/PreAddUpdate");
  }
  getCustomerByDocumentId(id: string) {
    return this.http.get(this.common.rooturl + "/Customer/GetCustomerByDocumentId/" + id);
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Customer/Pagination/" + pageNumber);
  }
  Transactions(customer: CustomerModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Customer/InsertCustomerFromScreen/", customer);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Customer/UpdateCustomer/", customer);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Customer/DeleteCustomerAsync/" + customer.DocumentId);
    }
  }

  insertCustomersFromExcel(customers) {
      return this.http.post(this.common.rooturl + "/Customer/InsertCustomersFromExcel/", customers);
  }
}
