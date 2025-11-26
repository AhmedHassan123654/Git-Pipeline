import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { ExtraExpensesModel } from "../../Models/Transactions/extra-expenses-model";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class ExtraExpensesService {
  isExtraExpenses: BehaviorSubject<boolean> = new BehaviorSubject(false);
  openExtraExpenses: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/ExtraExpense/FirstOpen");
  }
  extraFirstOpen() {
    return this.http.get(this.common.rooturl + "/ExtraExpense/ExtraFirstOpen");
  }
  VendorOREmp(DocumentID: any) {
    return this.http.get(this.common.rooturl + "/ExtraExpense/VendorOREmp/" + DocumentID);
  }
  getById(DocumentID: string) {
    return this.http.get(this.common.rooturl + "/ExtraExpense/GetByDocumentID/" + DocumentID);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/ExtraExpense/print/", model);
  }

  getGrideList(filter:any) {
    return this.http.post(this.common.rooturl + "/ExtraExpense/GetGrideList" , filter);
  }
  GetAll() {
    return this.http.get(this.common.rooturl + "/ExtraExpense/GetAllExtraExpenses");
  }
  Transactions(extraexpenses: ExtraExpensesModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/ExtraExpense/PostExtraExpense/", extraexpenses);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/ExtraExpense/PutExtraExpense/", extraexpenses);
    }
    if (functiontype == "Delete") {
      return this.http.delete(
        this.common.rooturl + "/ExtraExpense/DeleteExtraExpenseAsync/" + extraexpenses.DocumentId
      );
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/ExtraExpense/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/ExtraExpense/PreAddUpdateAsync");
  }
}
