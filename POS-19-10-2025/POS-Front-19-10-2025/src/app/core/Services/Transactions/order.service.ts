import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { NoteModel } from "../../Models/Transactions/note-model";
import { OrderModel } from "../../Models/order/orderModel";
import { CustomerModel } from "../../Models/Transactions/CustomerModel";
import { CustomerAddressModel } from "../../Models/Transactions/CustomerAddressModel";
import { tap } from "rxjs/operators";
import { BehaviorSubject, Observable } from "rxjs";
import { IncomingUserModel } from "../../Models/Transactions/incoming-user-model";
import { WorktimesModel } from "../../Models/Transactions/worktimesModel";
import { Combo, ProductModel } from "../../Models/Transactions/product-model";
import { SettingModel } from "../../Models/Transactions/setting-model";

@Injectable({
  providedIn: "root"
})
export class OrderService {
  //#region Date
  allOrderTypes: any[];
  //#endregion
  stopLoaderOnError = false;
  pendingOrdersStarted = false;
  workTime:WorktimesModel | null  = null;
  shiftAlertFired:boolean = false;
  closeOrderFromPayment = false;
  originalSubTotal: BehaviorSubject<number> = new BehaviorSubject(0);
  showDeliveryPopup:boolean = false;
  isCallCenterOrder: BehaviorSubject<boolean> = new BehaviorSubject(false);
  customerList: CustomerModel[];
  customerAddressList: CustomerAddressModel[];
  settings: SettingModel;
  isCouponAccepted: BehaviorSubject<boolean> = new BehaviorSubject(false);
  type: BehaviorSubject<number> = new BehaviorSubject(0);
  free: BehaviorSubject<boolean> = new BehaviorSubject(false);
  foodPlans:any[] = [];
  // For generic use
  public isAdmin: any;
  public userPermissions: any;
  entertainmentServiceProducts:ProductModel[] = [];
  originalProductList:ProductModel[] = [];
  allCombos:Combo[] = [];
  constructor(private http: HttpClient, public common: CommonService) {}

  //#region Order

  FirstOpen() {
    return this.http.get(this.common.rooturl + "/Order/FirstOpen").pipe(
      tap((res) => {
        if (!res) return;
        this.isAdmin = res["userWithPermission"]["Item1"];
        this.userPermissions = res["userWithPermission"]["Item2"];
      })
    );
  }
  updateAllProductsAfterOrdersSave() {
    return this.http.get(this.common.rooturl + "/Order/UpdateAllProductsAfterOrdersSave");
  }

  CompressGZip(param: string) {
    return this.http.post(this.common.rooturl + "/Order/CompressGZip", {
      Json: param
    });
  }

  MenuFirstOpen() {
    return this.http.get(this.common.rooturl + "/Order/MenuFirstOpen");
  }

  GetUserWithPermission() {
    return this.http.get(this.common.rooturl + "/Order/GetUserWithPermission");
  }

  GetAllNotes() {
    return this.http.get(this.common.rooturl + "/Order/GetAllNotes");
  }

  GetFilteredNotes(searchKey: string) {
    return this.http.get(this.common.rooturl + "/Order/GetFilteredNotes/" + encodeURIComponent(searchKey || ""));
  }

  GetAllUnClosedOrders() {
    return this.http.get(this.common.rooturl + "/Order/GetAllUnClosedOrders");
  }

  GetMobileOrders() {
    return this.http.get(this.common.rooturl + "/Order/GetMobileOrders");
  }

  DeleteMobileOrder(documentId: string) {
    return this.http.get(this.common.rooturl + "/Order/DeleteMobileOrder/" + documentId);
  }
  getTableHistory(tableId: string) {
    return this.http.get(this.common.rooturl + "/Order/GetTableHistory/" + tableId);
  }

  HelperFirstOpen() {
    return this.http.get(this.common.rooturl + "/Order/HelperFirstOpen");
  }

  GetOrdersWithTablesAsync( setting:SettingModel) {
    return this.http.post(this.common.rooturl + "/Order/GetOrdersWithTablesAsync",setting);
  }

  GetAllInsurances() {
    return this.http.get(this.common.rooturl + "/Order/GetAllInsurances");
  }

  GetAllRegions() {
    return this.http.get(this.common.rooturl + "/Order/GetAllRegions");
  }

  GetRegionsDeliveryPrice(RegionId: number) {
    return this.http.get(this.common.rooturl + "/Order/GetRegionsDeliveryPrice/" + RegionId);
  }

  GetProductByCode(productnumber: any) {
    return this.http.get(this.common.rooturl + "/Order/GetProductByCode/" + productnumber);
  }

  GetUserByPinCode(pin: string) {
    return this.http.get(this.common.rooturl + "/Order/GetUserByPinCode/" + pin);
  }

  GetCustomerByPhone(phone: string) {
    return this.http.get(this.common.rooturl + "/Order/GetCustomerByPhone/" + phone);
  }

  GetCustomerByMobileOrName(customer: CustomerModel) {
    return this.http.post(this.common.rooturl + "/Order/GetCustomerByMobileOrNameAsync/", customer);
  }

  GetEmployeeByName(name: string) {
    return this.http.get(this.common.rooturl + "/Order/GetEmployeeByNameAsync/" + name);
  }

  GetCustomerAddress(id: string) {
    return this.http.get(this.common.rooturl + "/Order/GetCustomerAddress/" + id);
  }

  GetOrderForTabel(id: string) {
    return this.http.get(this.common.rooturl + "/Order/GetOrderForTabel/" + id);
  }
  GetOldOrderToEdit(order: any) {
    return this.http.post(this.common.rooturl + "/Order/GetOldOrderToEdit", order);
  }

  SetOrderDone(model) {
    return this.http.post(this.common.rooturl + "/Order/SetOrderDone", model);
  }

  stopProductForAwhile(model) {
    return this.http.post(this.common.rooturl + "/Order/StopProductForAwhile", model);
  }

  getAllProductProperties() {
    return this.http.get(this.common.rooturl + "/Order/GetAllProductProperties");
  }

  SetAllOrderDone(model) {
    return this.http.post(this.common.rooturl + "/Order/SetAllOrderDone", model);
  }

  getAllChefScreens() {
    return this.http.get(this.common.rooturl + "/Order/GetAllChefScreens");
  }

  GetAllOrderTypes() {
    return this.http.get(this.common.rooturl + "/Order/GetAllOrderTypes");
  }

  openkeyboard() {
    return this.http.post(this.common.rooturl + "/User/openkeyboard", null);
  }

  PostCustomer(customer: CustomerModel) {
    return this.http.post(this.common.rooturl + "/Order/PostCustomer/", customer);
  }

  PostCustomerAddress(customerAddress: CustomerAddressModel) {
    return this.http.post(this.common.rooturl + "/Order/PostCustomerAddress/", customerAddress);
  }

  PutCustomerAddress(customerAddress: CustomerAddressModel) {
    return this.http.put(this.common.rooturl + "/Order/UpdateCustomerAddress/", customerAddress);
  }

  UpdateCustomerFromOrder(customer) {
    return this.http.put(this.common.rooturl + "/Customer/UpdateCustomerFromOrder/", customer);
  }

  PostNote(note: NoteModel) {
    return this.http.post(this.common.rooturl + "/Order/PostNote/", note);
  }

  CloseOrder(order: OrderModel) {
    return this.http.post(this.common.rooturl + "/Order/CloseOrder/", order);
  }

  CloseMobileOrder(order: OrderModel) {
    return this.http.post(this.common.rooturl + "/Order/CloseMobileOrder/", order);
  }

  updateMobileOrderAsync(order: OrderModel) {
    return this.http.post(this.common.rooturl + "/Order/UpdateMobileOrderAsync/", order);
  }

  SplitOrder(model) {
    return this.http.post(this.common.rooturl + "/Order/SplitOrder/", model);
  }

  UpdateOrder(order: OrderModel) {
    return this.http.post(this.common.rooturl + "/Order/UpdateOrder/", order);
  }

  updateOrderInsurance(order: OrderModel) {
    return this.http.post(this.common.rooturl + "/Order/UpdateOrderReturnInsurance/", order);
  }

  checkAvailableQuantityBeforeSave(order: OrderModel) {
    return this.http.post(this.common.rooturl + "/Order/CheckAvailableQuantityBeforeSave/", order);
  }

  PrintOrder(order: OrderModel) {
    return this.http.post(this.common.rooturl + "/Order/PrintOrder/", order);
  }
  PrintKOT(order: OrderModel) {
    return this.http.post(this.common.rooturl + "/Order/PrintKOT/", order);
  }
  PrintBundeldReceipt(order: OrderModel) {
    return this.http.post(this.common.rooturl + "/Order/PrintBundeldReceipt/", order);
  }
  PrintPreviewOrder(order: OrderModel) {
    return this.http.post(this.common.rooturl + "/Order/PrintPreviewOrder/" , order);
  }
  PrintOrderWithDataSet(model) {
    return this.http.post(this.common.rooturl + "/Order/PrintOrderWithDataSet/", model);
  }

  VFDDisplay(model) {
    return this.http.post(this.common.rooturl + "/Order/VFDDisplay/", model);
  }

  PrintOrderWithPreview(documentId: string) {
    return this.http.get(this.common.rooturl + "/Order/PrintOrderWithPreview/" + documentId);
  }
  PrintWithPreview(order: any) {
    return this.http.post(this.common.rooturl + "/Order/PrintWithPreview", order);
  }
 
  checkUserWithOption(model: any) {
    return this.http.post(this.common.rooturl + "/Order/CheckUserWithOption/", model);
  }

  CheckPinUserWithPermission(pin: string) {
    return this.http.get(this.common.rooturl + "/Order/CheckPinUserWithPermission/" + pin);
  }

  CheckAvailableIncomingUser(model: any) {
    return this.http.post(this.common.rooturl + "/Order/CheckAvailableIncomingUser/", model);
  }

  GetAllOpenOrders(model: any) {
    return this.http.post(this.common.rooturl + "/Order/GetAllOpenOrders/", model);
  }

  GetAllDayOrders() {
    return this.http.get(this.common.rooturl + "/Order/GetAllDayOrders");
  }
  getLastOrder() {
    return this.http.get(this.common.rooturl + "/Order/GetLastOrder");
  }

  saveProductProperties(model: any) {
    return this.http.post(this.common.rooturl + "/Order/SaveProductProperties/", model);
  }

  saveListProductProperties(model: any) {
    return this.http.post(this.common.rooturl + "/Order/SaveListProductProperties/", model);
  }

  uploadImage(model: any) {
    return this.http.post(this.common.rooturl + "/Order/UploadImage/", model);
  }

  getAllSalesCount() {
    return this.http.get(this.common.rooturl + "/Order/GetAllSalesCount");
  }

  updateOrderStatus(input) {
    return this.http.post(this.common.rooturl + "/Integration/UpdateOrderStatus", input);
  }

  getGetirYemekCancelOptions(orderId: string) {
    return this.http.get(this.common.rooturl + "/Integration/GetGetirYemekCancelOptions/" + orderId);
  }

  getTrendyolCancelOptions() {
    return this.http.get(this.common.rooturl + "/Integration/GetTrendyolCancelOptions");
  }

  updateIntegrationProduct(input) {
    return this.http.post(this.common.rooturl + "/Integration/UpdateIntegrationProduct", input);
  }

  GetOrdersCustomer(customerId: string) {
    return this.http.get(this.common.rooturl + "/Customer/GetOrdersCustomer/" + customerId);
  }
  OpenDay(IncomingUser: IncomingUserModel) {
    return this.http.post(this.common.rooturl + "/User/OpenDay", IncomingUser);
  }

  //#endregion

  //#region CallCenter
  severSyncUrl = this.common.rooturl.toString().replace("/api", "");

  GetMobileOrdersCount(pos) {
    return this.http.post(this.severSyncUrl + "/ServerSync/GetMobileOrdersCount", pos);
  }

  updateTableStatusSync(tableStatusId: any) {
    return this.http.get(
      this.severSyncUrl + "/ServerSync/UpdateTableStatusSync?tableStatusDocumentId=" + tableStatusId
    );
  }

  GetBranchCallCenterOrders() {
    return this.http.get(this.severSyncUrl + "/ServerSync/GetBranchCallCenterOrders");
  }

  GetBranchCallCenterOrdersFromOnlineOrderCallCenter(BranchDocumentId: any) {
    return this.http.get(
      this.common.rooturl + "/Order/GetBranchCallCenterOrdersFromOnlineOrderCallCenter/" + BranchDocumentId
    );
  }

  // GetBranchCallCenterOrdersFromOnlineOrderCallCenterCount(BranchDocumentId:any) {
  //   return this.http.get(this.severSyncUrl + "/ServerSync/GetBranchCallCenterOrdersFromOnlineOrderCallCenterCount/"+BranchDocumentId);
  // }

  UpdateCallCenterOrderStatus(model) {
    return this.http.post(this.severSyncUrl + "/ServerSync/UpdateCallCenterOrderStatus", model);
  }

  GetAllCallCenterOrders() {
    return this.http.get(this.severSyncUrl + "/ServerSync/GetAllCallCenterOrders");
  }

  //#endregion

  GetAllItems() {
    return this.http.get(this.common.rooturl + "/Order/GetAllItems");
  }

  OpenDrawer() {
    return this.http.get(this.common.rooturl + "/Order/OpenDrawer");
  }

  CheckPinOrPassword(pinOrPassword: string) {
    return this.http.get(this.common.rooturl + "/Order/CheckPinOrPassword/" + pinOrPassword);
  }

  GetNotPrintedOrders() {
    return this.http.get(this.common.rooturl + "/Order/GetNotPrintedOrders");
  }

  GetAllImages() {
    return this.http.get(this.common.rooturl + "/Order/GetAllImages");
  }

  UpdateItemsQuantities(documentId: string) {
    return this.http.get(this.common.rooturl + "/Order/UpdateItemsQuantities/" + documentId);
  }
  getFoodPlanDataForEmployee(order: OrderModel) {
    return this.http.post(this.common.rooturl + "/FoodPlan/GetFoodPlanDataForEmployee",  order);
  }

  /**
   * Check POS screen permissions
   */
  hasPermission(screenName: string): boolean {
    if (this.isAdmin) return true;
    else {
      if (!this.userPermissions || !this.userPermissions.find((x) => x.POSScreenPermissions)) return false;
      else {
        const permissions = this.userPermissions
          .map((p) => {
            return p.POSScreenPermissions;
          })
          .reduce((a, b) => {
            return a.concat(b);
          }, []);

        if (screenName) {
          const exist = permissions.find((s) => s.ScreenName == screenName && s.View);
          return !!exist;
        } else {
          const exist = permissions.filter(
            (s) => (s.ScreenName == "ReturnOrder" || s.ScreenName == "FollowOrders") && s.View
          )[0];
          return !!exist;
        }
      }
    }
  }

  /**
   * Has role check
   */
  hasRole(roleName: string): boolean {
    if (this.isAdmin) return true;
    else {
      if (!this.userPermissions || !this.userPermissions.find((x) => x.POSUserRoleOptions)) return false;

      const roleGroup: any = this.userPermissions.find((x) => x.POSUserRoleOptions);

      const roles: any[] = roleGroup ? roleGroup.POSUserRoleOptions : [];

      const role = roles.find((r) => r.Name == roleName);

      if (!role) return false;

      return role.IsGranted;
    }
  }

  GetMyPointsFirstOpenAsync(): Observable<any> {
    return this.http.get(this.common.rooturl + "/MyPoints/MyPointsFirstOpenAsync");
  }
  GetScalerWeight(): Observable<any> {
    return this.http.get(this.common.rooturl + "/ZebraScale/GetWeight");
  }
}
