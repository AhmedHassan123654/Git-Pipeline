import { Injectable } from "@angular/core";
import { OrderPayTypeModel } from "../../Models/Transactions/order-pay-type-model";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
@Injectable({
  providedIn: "root"
})
export class PayTypeService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/PaymentType/FirstOpen");
  }
  getAllPaymentTypes() {
    return this.http.get(this.common.rooturl + "/PaymentType/GetAllPaymentTypes");
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/PaymentType/GetByDocumentID/" + DocumentID);
  }

  getGrideList() {
    return this.http.get(this.common.rooturl + "/PaymentType/GetGrideList");
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/PaymentType/PreAddUpdate");
  }

  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/PaymentType/Pagination/" + pageNumber);
  }
  Transactions(Paytype: OrderPayTypeModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/PaymentType/InsertOrderPayTypeAsync/", Paytype);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/PaymentType/UpdateOrderPayTypeAsync/", Paytype);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/PaymentType/DeleteOrderPayTypeAsync/" + Paytype.DocumentId);
    }
  }
}
