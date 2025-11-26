import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BranchModel } from "../../Models/Authentication/branch-model";
import { ProductGroupModel } from "../../Models/Transactions/product-group-model";
import { ProductModel } from "../../Models/Transactions/product-model";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class SassWizardService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/SassWizard/FirstOpen");
  }
  GetDefaultBranch() {
    return this.http.get(this.common.rooturl + "/SassWizard/GetDefaultBranch");
  }
  GetProductGroupsAndPrinter() {
    return this.http.get(this.common.rooturl + "/SassWizard/GetProductGroupsAndPrinter");
  }
  InsertOrUpdateBranchAsync(branch: BranchModel) {
    return this.http.post(this.common.rooturl + "/SassWizard/InsertOrUpdateBranchAsync/", branch);
  }
  InsertProductGroupAsync(ProductGroupModel: ProductGroupModel) {
    return this.http.post(this.common.rooturl + "/SassWizard/InsertProductGroupAsync/", ProductGroupModel);
  }
  InsertPrinter(printermodel: any) {
    return this.http.post(this.common.rooturl + "/SassWizard/PostPrinter/", printermodel);
  }
  InsertProductAsync(ProductModel: ProductModel) {
    return this.http.post(this.common.rooturl + "/SassWizard/InsertProductAsync/", ProductModel);
  }
}
