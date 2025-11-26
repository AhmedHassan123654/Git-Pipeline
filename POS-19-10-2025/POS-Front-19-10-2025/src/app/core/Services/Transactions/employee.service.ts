import { Injectable } from "@angular/core";
import { CommonService, HttpClient } from "src/app/shared/Directives/pagetransactionsimport";
import { EmployeeModel } from "../../Models/Transactions/employee-model";

@Injectable({
  providedIn: "root"
})
export class EmployeeService {
  constructor(private http: HttpClient, private common: CommonService) {}
  Transactions(EmployeeModel: EmployeeModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Employee/InsertEmployee/", EmployeeModel);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Employee/UpdateEmployee/", EmployeeModel);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Employee/DeleteEmployee/" + EmployeeModel.DocumentId);
    }
  }
  firstOpen() {
    return this.http.get(this.common.rooturl + "/Employee/FirstOpen");
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/Employee/GetGrideList");
  }
  GetEmployeeLookUps() {
    return this.http.get(this.common.rooturl + "/Employee/GetEmployeeLookUps");
  }
  UserTypesList() {
    return this.http.get(this.common.rooturl + "/Employee/UserTypesList");
  }

  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/Employee/GetByDocumentID/" + DocumentId);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Employee/PreAddUpdate");
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Employee/Pagination/" + pageNumber);
  }
  print(model: any) {
    return this.http.post(this.common.rooturl + "/Employee/print/", model);
  }
  UploadImages(formData: any, EmpId: any) {
    return this.http.post(this.common.rooturl + "/Employee/UploadImages/" + EmpId, formData);
  }
}
