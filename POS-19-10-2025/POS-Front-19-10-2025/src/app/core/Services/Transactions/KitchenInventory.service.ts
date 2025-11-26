import { Injectable } from "@angular/core";
import { HttpClient, CommonService } from "src/app/shared/Directives/pagetransactionsimport";

@Injectable({
  providedIn: "root"
})
export class KitchenInventoryService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/KitchenInventory/FirstOpen");
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/KitchenInventory/PreAddUpdate");
  }
  GetAllInventories() {
    return this.http.get(this.common.rooturl + "/KitchenInventory/GetAllInventories");
  }

  Transactions(inventory: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/KitchenInventory/PostInventory/", inventory);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/KitchenInventory/PutInventory/", inventory);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/KitchenInventory/DeleteInventory/" + inventory.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/KitchenInventory/Pagination/" + pageNumber);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/KitchenInventory/GetGrideList");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/KitchenInventory/GetByDocumentId/" + DocumentId);
  }

  downloadStockItems(inventory: any) {
    return this.http.post(this.common.rooturl + "/KitchenInventory/GetStockItems/", inventory);
  }
}
