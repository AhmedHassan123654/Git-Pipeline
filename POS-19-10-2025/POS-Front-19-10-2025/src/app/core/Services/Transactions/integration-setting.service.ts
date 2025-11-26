import { Injectable } from "@angular/core";
import { CommonService } from "src/app/Features/branch/branchimport";
import { HttpClient } from "src/app/shared/Directives/pagetransactionsimport";
import { IntegrationSettingModel } from "../../Models/Transactions/integration-setting-model";

@Injectable({
  providedIn: "root"
})
export class IntegrationSettingService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/IntegrationSetting/FirstOpen");
  }

  GetIntegrationSystems() {
    return this.http.get(this.common.rooturl + "/IntegrationSetting/GetIntegrationSystems");
  }

  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/IntegrationSetting/GetByDocumentID/" + DocumentId);
  }

  GetIntegrationSettingproduct(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/IntegrationSetting/GetIntegrationSettingproduct/" + DocumentId);
  }

  GetIntegrationSettingPayments(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/IntegrationSetting/GetIntegrationSettingPayments/" + DocumentId);
  }

  Transactions(IntegrationSettingModel: IntegrationSettingModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(
        this.common.rooturl + "/IntegrationSetting/InsertIntegrationSetting/",
        IntegrationSettingModel
      );
    }
    if (functiontype == "PostProduct") {
      return this.http.post(
        this.common.rooturl + "/IntegrationSetting/InsertIntegrationSettingProduct/",
        IntegrationSettingModel
      );
    }
    if (functiontype == "Edit") {
      return this.http.put(
        this.common.rooturl + "/IntegrationSetting/UpdateIntegrationSetting/",
        IntegrationSettingModel
      );
    }
    if (functiontype == "Delete") {
      return this.http.delete(
        this.common.rooturl + "/IntegrationSetting/DeleteIntegrationSetting/" + IntegrationSettingModel.DocumentId
      );
    }
  }

  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/IntegrationSetting/Pagination/" + pageNumber);
  }

  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/IntegrationSetting/PreAddUpdate");
  }

  /*  print(model:any)
  {
    return this.http.post(this.common.rooturl+'/PricingClasses/print/',model);
  } */
  getGrideList() {
    return this.http.get(this.common.rooturl + "/IntegrationSetting/GetGrideList");
  }

  pullProdutFromServer(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/Integration/PullProdutsFromServer/" + DocumentId);
  }

  pullPaymentFromServer(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/Integration/PullPaymentsFromServer/" + DocumentId);
  }

  updateIntegrationProducts(model) {
    return this.http.post(this.common.rooturl + "/Integration/UpdateIntegrationProducts", model);
  }

  updateIntegrationPaymnts(model) {
    return this.http.post(this.common.rooturl + "/Integration/UpdateIntegrationPaymnts", model);
  }

  getRestaurantStatus(integrationSystemType: number) {
    return this.http.post(this.common.rooturl + "/Integration/GetRestaurantStatus", {
      Integration: integrationSystemType
    });
  }

  updateRestaurantStatus(integrationSystemType: number, status: boolean) {
    return this.http.post(this.common.rooturl + "/Integration/UpdateRestaurantStatus", {
      Integration: integrationSystemType,
      IsOpen: status
    });
  }
}
