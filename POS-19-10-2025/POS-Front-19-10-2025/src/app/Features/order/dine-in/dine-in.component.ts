import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  ViewChild,
  ɵConsole,
  Output,
  EventEmitter
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { OrderModel } from "src/app/core/Models/order/orderModel";
import { AngularResizableDirective } from "angular2-draggable";
import { TabelsHallService } from "src/app/core/Services/order/TabelsHallService";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
import { BranchModel, BranchService } from "../../branch/branchimport";
import { LocalstorgeService } from "../../../localstorge.service";

@Component({
  selector: "app-dine-in",
  templateUrl: "./dine-in.component.html",
  styleUrls: ["./dine-in.component.css"]
})
export class DineInComponent implements OnInit {
  @Output() cancelDinin = new EventEmitter<any>();
  @Output() cancelDininAndAddGame = new EventEmitter<any>();
  @Input() _orderobj: OrderModel;
  language: string;
  SideMenu: boolean = false;
  hall: any;
  halls: any = [];
  ordersWithTables: any = [];
  popupOpen: boolean = false;
  pricingClasses: any = [];
  Tables: any = [];
  FLG: any;
  interv3: any;
  fraction: string;
  Branches:BranchModel[];
  entertainmentServiceTimes = [
    {
      Name: this.translate.instant("products.ForMinute"),
      DocumentId: 1
    },
    {
      Name: this.translate.instant("products.ForHourQuarter"),
      DocumentId: 2
    }];
  // hideTables:boolean = false;
  selectedTab: string;
  defaultLanguage: string;
  dLanguage: number;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    public router: Router,
    public route: ActivatedRoute,
    public hallServ: TabelsHallService,
    private toastr: ToastrService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private toastrMessage: HandlingBackMessages,
    public orderSer: OrderService,
    public branchSer: BranchService,
    private LocalstorgeService: LocalstorgeService,

  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.GetAllHalls();
    // this.hideTables = true;
  }

  ngOnInit() {
    this.FLG = { text: "Name", value: "DocumentId" };
    if (this.LocalstorgeService.get("lang") == null) this.LocalstorgeService.set("lang", "en");

    this.dLanguage = this.LocalstorgeService.get("lang");

    this.GetAllPricingClasses();
    //////////////////////////fraction-Pipe////////////////////////////
    if (this._orderobj && this._orderobj.settings)
      this.fraction = "." + this._orderobj.settings.Round + "-" + this._orderobj.settings.Round;
    // this.refresh();
    this.GetOrdersWithTablesAsync();
    this.interv3 = setInterval(() => {
      this.GetOrdersWithTablesAsync();
    }, 10000);
  }

  ngOnDestroy() {
    if (this.interv3) {
      clearInterval(this.interv3);
    }
  }

  // refresh(hide = false){
  //   if(this._orderobj && this._orderobj.pointOfSale)
  //     this.hideTables = hide;
  // }
  addNewTab() {
    if (this.hall && this.hall.Name) {
      // debugger
      this.InsertHall(this.hall);
      this.popupOpen = false;
    } else {
      this.popupOpen = false;
    }
  }

  /**
 * Inserts tables for a hall within a specified range.
 * @param model An object containing details of the hall and the range of tables to insert.
 *              It should have the properties: From (number), To (number), and Tables (array).
 *              - From: The starting index of the table range.
 *              - To: The ending index of the table range.
 *              - Tables: An array to store table objects.
 * @returns void
 */
InsertHall(model: any): void {
  // Check if valid range is provided
  if (model.From > 0 && model.To > 0 && model.From < model.To) {
    // Check if the number of tables exceeds the maximum limit
    if ((model.To - model.From + 1) > 30) {
      this.toastr.warning(this.translate.instant("Shared.GenerateTablesAutomatically"));
      return;
    }
    // Initialize tables array
    model.Tables = [];
    // Define constants
    const tablesPerRow = 6; // Number of tables per row
    let index = 1; // Initialize table index

    // Loop through the specified range of tables
    for (let num = model.From; num <= model.To; num++) {
      // Calculate row and positions for the current table
      const row = Math.floor((index - 1) / tablesPerRow);
      const newXPosition = 18 + ((index - 1) % tablesPerRow) * 247; 
      const newYPosition = 48 + row * 120;
      // Increment table index
      index++;
      // Create table object and push it to the tables array
      model.Tables.push({
        Name: "table" + num,
        Color: "rgb(255, 229, 218)",
        Shape: "5px",
        Transform: "translate(232px, 1px)",
        XPosition: newXPosition + "px",
        YPosition: newYPosition + "px",
        Width: "220px",
        Height: "110px",
      });
    }
  }

  // Insert the hall data into the database
  this.hallServ.InsertHall(model).subscribe(
    (res) => {
      if (res == 1 || res == 2) {
        // Show success message and refresh halls list
        this.toastr.success(this.toastrMessage.GlobalMessages(res), "halls");
        this.GetAllHalls();
      } else {
        // Show warning message if insertion failed
        this.toastr.warning(this.toastrMessage.GlobalMessages(res), "halls");
      }
    },
    (err) => {
      // Show error message if an error occurred
      this.toastr.error(this.toastrMessage.GlobalMessages(err), "halls");
    }
  );
}

  getAllBranches(){
    if(this.Branches && this.Branches.length) return;
    this.branchSer.getLookUp().subscribe((res:any) => {
      this.Branches = res;
    });
  }

  GetAllHalls() {
    this.hallServ.GetHallsForOrder().subscribe((res) => {
      this.halls = res;
      // debugger
      if (this.halls && this.halls.length > 0) {
        if (this._orderobj && !this._orderobj.isAdmin && this._orderobj.userPermissions) {
          let HallIds = [];
          if (
            this._orderobj.userPermissions.map((x) => x.POSHalls) &&
            this._orderobj.userPermissions.map((x) => x.POSHalls).length > 0
          ) {
            let POSHalls = this._orderobj.userPermissions
              .map((x) => x.POSHalls)
              .reduce(function (a, b) {
                return a.concat(b);
              }, []);
            HallIds = POSHalls.map((x) => x.DocumentId);
          }
          this.halls = this.halls.filter((x) => HallIds.includes(x.DocumentId));
        } else this.halls = this.halls;
        this.selectedTab = this.halls[0].Name || "";
      }
      this.GetOrdersWithTablesAsync();
    });
    this.popupOpen = false;
  }

  GetOrdersWithTablesAsync() {
    this.orderSer.GetOrdersWithTablesAsync(this.orderSer?.settings).subscribe((res:any) => {
      // debugger
      this.ordersWithTables = res?.orderWithTables;
      const customerOrdersTables = res?.customerOrdersTables;
      if (this.halls && this.halls.length > 0) {
        let tables = [];
        this.halls.forEach((h) => {
          let tbls = h.Tables;
          tbls.forEach((tbl) => {
            tbl.HallId = h.DocumentId;
            tbl.CustomerOrdersCount = customerOrdersTables?.find(c=> c.TableId == tbl.DocumentId)?.Count;
            tables.push(tbl);
          });
        });
        this.ordersWithTables.forEach((t) => {
          // debugger
          let table = tables.filter((t2) => t2.DocumentId == t.TableId)[0];
          if (table) {
            table.Count = t.OrdersCount;
            table.TableName = t.TableName;
            table.OrderPrintCount = t.OrderPrintCount[0] && t.OrderPrintCount[0].Value ? t.OrderPrintCount[0].Value : 0;
            table.PersonsCount = t.PersonsCount;
            table.Total = t.Total;
            table.CaptainName = t.CaptainName;
            table.CaptainDocumentId = t.CaptainDocumentId;
            table.CreationTime = t.CreationTime;
            table.CreatorUserId = t.CreatorUserId;
            table.CashierName = t.CashierName;
            table.NotPrinted = t.NotPrinted;
            table.IsStopDrag = !this.checkAnotherCaptainOrUser(t);
            t.HallId = table.HallId;
            this.halls
              .filter((h) => h.DocumentId == table.HallId)[0]
              .Tables.filter((tt) => tt.DocumentId == table.DocumentId)[0] == table;
          }
        });
        const orderWithTablesIds = this.ordersWithTables.map(t=> t.TableId);
        let finishedTables = this.halls?.flatMap(h=>h.Tables)?.filter(t=>t.Count && !orderWithTablesIds.includes(t.DocumentId));
        finishedTables?.forEach(table => {
          table.Count = 0;
            table.OrderPrintCount = 0;
            table.Total = 0;
            table.CaptainName = '';
            table.CaptainDocumentId ='';
            table.CashierName = '';
            table.NotPrinted = false;
            table.IsStopDrag = false;
        });
      }
    });
  }

  ////////////////////////ordersTotalByHall//////////////////////////
  ordersTotalByHall(hall: any) {
    //  debugger
    if (
      this._orderobj &&
      this._orderobj.validationList &&
      this._orderobj.validationList["CanViewTotalOfOrdersInHall"]
    ) {
      this._orderobj.userPermissions;
      let TotalByHall = this.ordersWithTables
        .filter((o) => o.HallId == hall.DocumentId)
        .map((o) => o.Total)
        .reduce((a, b) => a + b, 0);
      return TotalByHall;
    }
  }

  checkAnotherCaptainOrUser(o = null) {
    // debugger
    if (
      o.OrdersCount > 0 &&
      this._orderobj &&
      this._orderobj.pointOfSale &&
      this._orderobj.pointOfSale.IsHallPos &&
      (this._orderobj.settings.CanNotEditOrderByAnother ||
        this._orderobj.validationList["CanNotEditOrderForAnotherUser"]) &&
      this._orderobj.CaptainDocumentId != o.CaptainDocumentId
    ) {
      return false;
    } else if (
      o &&
      o.OrdersCount > 0 &&
      this._orderobj.pointOfSale &&
      !this._orderobj.pointOfSale.IsHallPos &&
      this._orderobj.settings &&
      (this._orderobj.settings.CanNotEditOrderByAnother ||
        this._orderobj.validationList["CanNotEditOrderForAnotherUser"]) &&
      this._orderobj.appUserId != o.CreatorUserId
    ) {
      return false;
    } else return true;
  }

  GetAllPricingClasses() {
    this.hallServ.GetAllPricingClasses().subscribe((res) => {
      // debugger
      this.pricingClasses = res;
    });
  }

  GetAllTables() {
    this.hallServ.GetAllTables().subscribe((res) => {
      this.Tables = res;
    });
  }

  listClick(tab) {
    this.selectedTab = tab;
  }

  removeMe(tab) {
    if (confirm("Are you sure to Remove")) {
      let curTab = this.halls.filter((x) => x.Name == tab.Name)[0];
      if (curTab) this.DeleteHall(curTab.DocumentId);
    }
  }

  DeleteHall(model: any) {
    this.hallServ.DeleteHall(model).subscribe(
      (res) => {
        this.toastr.success(this.toastrMessage.GlobalMessages(3), "halls");
        this.GetAllHalls();
      },
      (err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(err), "halls");
      }
    );
  }

  cancel(event) {
    this.cancelDinin.emit(event);
  }
  cancelAndAddGame(event) {
    this.cancelDininAndAddGame.emit(event);
  }

  EditHallPopUp() {
    // debugger
    this.getAllBranches();
    if(this.disableEditHalls) return;
    this.hall = this.halls.find((x) => x.Name == this.selectedTab);
    if (this.hall) this.popupOpen = true;
  }
  addHallPopUp(){
    this.getAllBranches();
    this.popupOpen = true;
    this.hall = {}
  }
  EditHall() {
    // debugger
    this.hallServ.UpdateHall(this.hall).subscribe(
      (res) => {
        if (res == 2) {
          this.toastr.success(this.toastrMessage.GlobalMessages(res));
        } else this.toastr.warning(this.toastrMessage.GlobalMessages(res));
        this.GetAllHalls();
        this.popupOpen = false;
      },
      (err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(err));
      }
    );
  }
  get disableEditHalls(){
    return this._orderobj && (this._orderobj.settings && this._orderobj.settings.PullAllTablesFromPOS)||(this._orderobj.validationList?.CannotAddAndEditHallsAndTables && !this._orderobj?.isAdmin);
  }
  getHallName(ob) {
    if(!ob) return '';
    if (this.dLanguage && this._orderobj.settings && this.language) {
       this.defaultLanguage = this.dLanguage == 2 ? "ar" : "en";
      if (this._orderobj.settings.ShowBothNameAndForeignName && ob.ForeignName && ob.ForeignName != "") {
        return ob.Name + " , " + ob.ForeignName;
      }
      if (this._orderobj.settings.NamesOfProductsBasedOnMainUserLang) {
        if (!this.language.includes(this.defaultLanguage) && ob.ForeignName && ob.ForeignName != "")
          return ob.ForeignName;
        else return ob.Name;
      }
      return ob.Name;
    }
    return ob.Name;
  }
}
