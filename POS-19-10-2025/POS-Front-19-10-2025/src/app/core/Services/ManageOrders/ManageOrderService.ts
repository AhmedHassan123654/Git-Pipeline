import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";

@Injectable({
  providedIn: "root"
})
export class ManageOrderService {
  constructor(private http: HttpClient, private common: CommonService) {}
  GetAllOrders(data: any) {
    return this.http.post(this.common.rooturl + "/ManageOrder/GetAllOrders", data);
  }
  manageOrderFirstOpen(data: any) {
    return this.http.post(this.common.rooturl + "/ManageOrder/ManageOrderFirstOpen", data);
  }
  DeleteOrder(Id: string) {
    return this.http.delete(this.common.rooturl + "/ManageOrder/DeleteOrder/" + Id);
  }

  GetAllOrderPayTypes() {
    return this.http.get(this.common.rooturl + "/ManageOrder/GetAllOrderPayTypes");
  }
  GetAllOrderTypes() {
    return this.http.get(this.common.rooturl + "/ManageOrder/GetAllOrderTypes");
  }
  UpdateOrder(order: any = {}) {
    return this.http.post(this.common.rooturl + "/ManageOrder/UpdateOrderFromManage", order);
  }
  SaveManageOrderSettingAsync(Setting: any = {}) {
    return this.http.post(this.common.rooturl + "/ManageOrder/SaveManageOrderSettingAsync", Setting);
  }
  GetManageOrderSetting() {
    return this.http.get(this.common.rooturl + "/ManageOrder/GetManageOrderSetting");
  }
}
