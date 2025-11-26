import { Injectable } from "@angular/core";
import { HttpClient, CommonService } from "src/app/shared/Directives/pagetransactionsimport";

@Injectable({
  providedIn: "root"
})
export class InventoryService {
  constructor(private http: HttpClient, private common: CommonService) {}

  firstOpen() {
    return this.http.get(this.common.rooturl + "/Inventory/FirstOpen");
  }
  preAddUpdate() {
    return this.http.get(this.common.rooturl + "/Inventory/PreAddUpdate");
  }
  GetAllInventories() {
    return this.http.get(this.common.rooturl + "/Inventory/GetAllInventories");
  }

  Transactions(inventory: any, functiontype: string) {
    if (functiontype == "Post") {
      return this.http.post(this.common.rooturl + "/Inventory/PostInventory/", inventory);
    }
    if (functiontype == "Edit") {
      return this.http.put(this.common.rooturl + "/Inventory/PutInventory/", inventory);
    }
    if (functiontype == "Delete") {
      return this.http.delete(this.common.rooturl + "/Inventory/DeleteInventory/" + inventory.DocumentId);
    }
  }
  Pagination(pageNumber: any) {
    return this.http.get(this.common.rooturl + "/Inventory/Pagination/" + pageNumber);
  }
  getGrideList() {
    return this.http.get(this.common.rooturl + "/Inventory/GetGrideList");
  }
  getById(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/Inventory/GetByDocumentId/" + DocumentId);
  }

  downloadStockItems(inventory: any) {
    return this.http.post(this.common.rooturl + "/Inventory/GetStockItems/", inventory);
  }
}
