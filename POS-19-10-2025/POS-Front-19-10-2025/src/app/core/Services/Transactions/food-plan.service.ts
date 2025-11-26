import { Injectable } from "@angular/core";
import { CommonService, HttpClient } from "src/app/shared/Directives/pagetransactionsimport";
import { FoodPlaneModel } from "../../Models/Transactions/food-plane-model";

@Injectable({
  providedIn: "root"
})
export class FoodPlanService {
  constructor(private http: HttpClient, private common: CommonService) {}
  firstOpen() {
    return this.http.get(this.common.rooturl + "/FoodPlan/FirstOpen");
  }

  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/FoodPlan/GetByDocumentID/" + DocumentId);
  }

  Transactions(FoodPlane: FoodPlaneModel, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/FoodPlan/PostFoodPlan/", FoodPlane);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/FoodPlan/UpdateFoodPlan/", FoodPlane);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/FoodPlan/DeleteFoodPlan/" + FoodPlane.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/FoodPlan/Pagination/" + pageNumber);
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/FoodPlan/PreAddUpdate");
  }
  /*  print(model:any)
  {
    return this.http.post(this.common.rooturl+'/FoodPlan/print/',model);
  } */
  getGrideList() {
    return this.http.get(this.common.rooturl + "/FoodPlan/GetGrideList");
  }
  GetemployeeFoodPlan(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/FoodPlan/GetemployeeFoodPlan/" + DocumentId);
  }
  GetproductFoodPlan(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/FoodPlan/GetproductFoodPlan/" + DocumentId);
  }
}
