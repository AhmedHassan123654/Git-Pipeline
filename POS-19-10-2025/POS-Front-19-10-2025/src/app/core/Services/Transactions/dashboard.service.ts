import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { CommonService } from "../Common/common.service";
import { IncomingUserModel } from "../../Models/Transactions/incoming-user-model";
import { EODReportModel } from "../../Models/Transactions/EODReportModel";

@Injectable({
  providedIn: "root"
})
export class DashboardService {
  // what's new handling
  isClicked: boolean = false;
  isSending: boolean = true;
  isOpenShift: boolean = false;
  isClosedShift: boolean = false;

  constructor(private http: HttpClient, private common: CommonService) {}
  FirstOpen() {
    return this.http.get(this.common.rooturl + "/Dashboard/FirstOpen");
  }
  GetNonAprovedReturnsCount() {
    return this.http.get(this.common.rooturl + "/Dashboard/GetNonAprovedReturnsCount");
  }
  GetHomeCharts() {
    return this.http.get(this.common.rooturl + "/Dashboard/GetHomeCharts");
  }
  GetPayList(DocumentId: string) {
    return this.http.get(this.common.rooturl + "/IncomingUser/GetPayList/" + DocumentId);
  }
  OpenDay(IncomingUser: IncomingUserModel) {
    this.isSending = false;
    return this.http.post(this.common.rooturl + "/User/OpenDay", IncomingUser);
  }
  EndShift(IncomingUser: IncomingUserModel) {
    return this.http.post(this.common.rooturl + "/IncomingUsers/EndShift", IncomingUser);
  }
  checkUnApprovedReturns(IncomingUser: IncomingUserModel) {
    return this.http.post(this.common.rooturl + "/IncomingUsers/CheckUnApprovedReturns", IncomingUser);
  }
  UpdateShift(IncomingUser: IncomingUserModel) {
    return this.http.post(this.common.rooturl + "/IncomingUsers/UpdateShift", IncomingUser);
  }
  getBestSellerProducts() {
    return this.http.get(this.common.rooturl + "/Dashboard/GetBestSellerProducts");
  }
  GetCategories() {
    return this.http.get(this.common.rooturl + "/IncomingUsers/Categories");
  }
  getStoppedProducts() {
    return this.http.get(this.common.rooturl + "/Dashboard/GetStoppedProducts");
  }
  getAllPromos() {
    return this.http.get(this.common.rooturl + "/Dashboard/GetAllPromos");
  }
  /*  checkUnclosedShift(){
    return this.http.get(this.common.rooturl + "/Dashboard/CheckUnclosedShift");
  } */
  checkUnclosedShiftfromUser() {
    return this.http.get(this.common.rooturl + "/User/CheckUnclosedShift");
  }
  getAllUsersInfo() {
    this.isSending = false;
    return this.http.get(this.common.rooturl + "/User/GetAllUsersInfo");
  }
  getActiveUsersInfo() {
    this.isSending = false;
    return this.http.get(this.common.rooturl + "/User/GetActiveUsersInfo");
  }
  getUsersLoockUp() {
    this.isSending = false;
    return this.http.get(this.common.rooturl + "/User/GetUsersLoockUp");
  }

  // New dashboard data with filters
  getNewDashboard(filters: any) {
    return this.http.post(this.common.rooturl + "/Dashboard/GetDashboardData", filters);
  }

  getEODReport(userName: any[], From, To) {
    return this.http.post(this.common.rooturl + "/EODReport/GetEODReport/" + From + "/" + To, userName);
  }

  deleteEODReport(eodReport: EODReportModel) {
    return this.http.delete(this.common.rooturl + "/EODReport/DeleteEODReport/" + eodReport.DocumentId);
  }
  GetNotificationCustomerOrder() {
    return this.http.get(this.common.rooturl + "/CustomerOrders/GetNotificationCustomerOrder");
  }
  printCustomerOrder(model: any) {
    return this.http.post(this.common.rooturl + "/CustomerOrders/print/", model);
  }
  GetFavoriteScreenList() {
    return this.http.get(this.common.rooturl + "/FavoriteScreen/GetFavoriteScreenList");
  }
  DeleteFavoritescreenAsync(FavoriteScreenDocumentId) {
    return this.http.delete(
      this.common.rooturl + "/FavoriteScreen/DeleteFavoritescreenAsync/" + FavoriteScreenDocumentId
    );
  }
  InsertFavoritescreen(model: any) {
    return this.http.post(this.common.rooturl + "/FavoriteScreen/InsertFavoritescreen/", model);
  }
}
