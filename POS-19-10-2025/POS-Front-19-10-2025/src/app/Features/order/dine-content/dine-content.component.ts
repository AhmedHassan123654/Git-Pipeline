import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { ColorPickerEventArgs, PaletteTileEventArgs } from "@syncfusion/ej2-inputs";
import { addClass } from "@syncfusion/ej2-base";
import { TabelsHallService } from "src/app/core/Services/order/TabelsHallService";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";

import { Router } from "@angular/router";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
import { BsModalRef, BsModalService } from "ngx-bootstrap/modal";
import { CustomerReservationComponent } from "../dialogs/customer-reservation/customer-reservation.component";
import { CustomerOrderService } from "../../../core/Services/Transactions/customerOrder.service";
import { OrderModel } from "../../../core/Models/order/orderModel";
import { OrderService } from "../../../core/Services/Transactions/order.service";
import { OrderComponent } from "../order/order.component";
import { TableGameComponent } from "../dialogs/table-game/table-game.component";
import { deepCopy } from "src/app/core/Helper/objectHelper";
import { BsDropdownConfig, BsDropdownDirective } from 'ngx-bootstrap/dropdown';

declare var Stimulsoft: any;
declare var $: any;

@Component({
  selector: "app-dine-content",
  templateUrl: "./dine-content.component.html",
  styleUrls: [
    "./dine-content.component.css",
    "./table-actions.component.css"
  ],
  providers: [BsDropdownConfig]
})
// export class DineContentComponent implements OnInit,OnChanges,OnDestroy {
export class DineContentComponent implements OnInit, OnDestroy {
  @ViewChild("ResizeAll", { static: true, read: ElementRef })
  ResizeAll: ElementRef;
  @ViewChild("myCanvas", { static: false })
  myCanvas: ElementRef<HTMLCanvasElement>;
  public context: CanvasRenderingContext2D;
  SizeAll = this.document.getElementsByClassName("ResizeAll");
  matches = this.document.getElementsByClassName("h");
  @Input() orderObj: OrderModel;
  @Input() dataTab: any;
  @Input() canvasId: string;
  @Input() currentHall: any;

  @Output() CloseDin = new EventEmitter<any>();
  @Output() CloseDinAndAddGame = new EventEmitter<any>();
  @Output() GetAllHalls = new EventEmitter<any>();
  language: string;
  SideMenu: boolean = false;
  data: any[];
  OpacityClicked: boolean = false;
  Canvas: any;
  fraction:string = '';

  showSearch:boolean = false;
  searchTableName:string = '';
  filtredTables:any[] = [];
  /**
   * Clicked table index
   */
  val: any;
  state = "";
  Url: string;
  size: any = null;
  position: any = null;
  count: number;
  content: any;
  TableNameText: boolean = false;

  editTableNameForPerview: boolean = false;
  perviewName: string;
  
  TableName: string;
  modalRef: BsModalRef;
  reservationModalRef?: BsModalRef | null;
  reservationInfo: any[] = [];
  interval: any;
  report: any = new Stimulsoft.Report.StiReport();

  constructor(
    @Inject(DOCUMENT) public document: Document,
    @Inject(OrderComponent) public _OrderComponent: OrderComponent,
    public hallServ: TabelsHallService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private toastrMessage: HandlingBackMessages,
    private router: Router,
    private customerOrderService: CustomerOrderService,
    public orderService: OrderService
  ) {
    if (!this.currentHall) this.currentHall = {};
    if (!this.currentHall.Tables) this.currentHall.Tables = [];
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  openModal(template: TemplateRef<any>) {
    // debugger
    this.Url = window.location.href.replace("order", "firstHome").replace("http://", "");
    this.modalRef = this.modalService.show(template);
  }

  ngOnInit() {
    this.currentHall.Tables = this.currentHall.Tables.sort((a, b) => a.Name - b.Name);
    this.currentHall.Tables.forEach((table) => {
      this.drowdTable(table);
    });
    this.caclulateTablesTime();
    this.searchTable(true);
    if (this.orderObj && this.orderObj.settings)
      this.fraction = "." + this.orderObj.settings.Round + "-" + this.orderObj.settings.Round;
  }

  isTimeGreaterThan30Minutes(tableOrder:any): boolean {
    if (tableOrder.DocumentId && tableOrder.FromTime) {
      const [hours, minutes, seconds] =  tableOrder.FromTime.split(":").map(Number);

      // Calculate the time difference in minutes
      const timeDifference = ((hours * 60) + minutes) > 30;

      // Compare with 2 minutes
      return timeDifference;
    }
    return false;
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   this.drawAllTables();
  // }
  drawAllTables() {
    if (this.orderObj && this.orderObj.pointOfSale && this.orderObj.pointOfSale.IsTabletDevice && this.currentHall) {
      this.currentHall.Tables.forEach((table) => {
        this.drowdTable(table);
      });
    }
  }

  secondsToDhms(seconds) {
    seconds = Number(seconds);
    let d = Math.floor(seconds / (3600 * 24));
    let h = Math.floor((seconds % (3600 * 24)) / 3600);
    let m = Math.floor((seconds % 3600) / 60).toString();
    let s = Math.floor(seconds % 60).toString();
    let totalHours = (d * 24 + h).toString();
    if (totalHours.length == 1) totalHours = "0" + totalHours;
    if (m.length == 1) m = "0" + m;
    if (s.length == 1) s = "0" + s;
    return `${totalHours}:${m}:${s}`;
    // var dDisplay = d > 0 ? d + (d == 1 ? " day, " : " days, ") : "";
    // var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
    // var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
    // var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    // return dDisplay + hDisplay + mDisplay + sDisplay;
  }

  caclulateTablesTime() {
    this.interval = setInterval(() => {
      this.currentHall.Tables.forEach((table) => {
        if (table.Count) {
          let diff = (new Date().getTime() - new Date(table.CreationTime).getTime()) / 1000;
          table.FromTime = this.secondsToDhms(diff);
        }
      });
    }, 1000);
  }

  closeNav() {
    this.SideMenu = false;
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  openNav() {
    if (this.SideMenu) {
      this.SideMenu = false;
    } else if(!this.showSearch){
      // when Search is open  do not open SideMenu
      this.SideMenu = true;
    }
  }

  colorClicked() {
    this.OpacityClicked = true;
  }

  shapeElement() {
    // debugger
    let ULselected = document.getElementById(this.dataTab);
    let liSelected = ULselected.getElementsByTagName("li")[this.val];
    if (liSelected.classList.contains("BorderRadius")) {
      liSelected.classList.remove("BorderRadius");
    } else liSelected.classList.add("BorderRadius");
    this.setStyleToElement(this.val);
  }

  UpdateHall() {
    // debugger
    this.hallServ.UpdateHall(this.currentHall).subscribe(
      (res) => {
        if (res == 2) {
          this.GetAllHalls.next();
          this.toastr.success(this.toastrMessage.GlobalMessages(res), "halls");
        } else this.toastr.warning(this.toastrMessage.GlobalMessages(res), "halls");
      },
      (err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(err), "tables");
      }
    );
  }

  textEditing() {
    if (this.filtredTables[this.val]) {
      this.TableNameText = !this.TableNameText;
      this.TableName = this.filtredTables[this.val].Name;
    }

  }

  updateName(tableName?:string) {
    debugger
    if(tableName.trim() === ''){
      this.toastr.warning("Name Cannot be Empty");
    }
    else{
      this.TableNameText = !this.TableNameText;
    }
    // this.filtredTables[this.val].Name = this.TableName ;
  }

  copy() {
    if (!this.currentHall.Tables) this.currentHall.Tables = [];
    this.currentHall.Tables.push({ Name: "table" });
    // this.drowdTable(this.currentHall.Tables.length-1);
  }

  // document.getElementById('add-to-list').onclick = function() {
  //   var list = document.getElementById('list');
  //   var newLI = document.createElement('li');
  //   newLI.innerHTML = 'A new item';
  //   list.appendChild(newLI);
  //   setTimeout(function() {
  //     newLI.className = newLI.className + " show";
  //   }, 10);
  // }
  drowdTable(table) {
    if (!table) return;
    let index = this.currentHall.Tables.indexOf(table);

    setTimeout(() => {
      let ULselected = document.getElementById(this.dataTab);

      let liElement = document.getElementById("liDrag" + index.toString() + this.dataTab.toString());
      if (!liElement) return;
      // let liElement = document.createElement('li');

      // liElement.id = "liDrag"+index;
      // liElement.className = 'h';
      liElement.style.backgroundColor = table.Color;
      if (table.Shape) liElement.style.borderRadius = table.Shape;

      // liElement.style.transform = table.Transform;
      // liElement.style.transformOrigin =table.Transform.replace("translate", "").replace(")", "").replace("(", "").replace(",", "")
      // liElement.innerHTML = "Paragraph changed!";

      // liElement.style.transformOrigin = "130px 50px";
      liElement.style.position = "absolute";
      liElement.style.transform = " translate(0px, 0px)";
      liElement.style.left = "0px";
      liElement.style.top = "0px";

      // check is tablet
      if (this.orderObj && this.orderObj.pointOfSale && this.orderObj.pointOfSale.IsTabletDevice) {
        let row = 1;
        if (index > 4) row = Math.floor(index / 5) + 1;

        let perv = row > 1 ? (row - 1) * 5 + 1 : row;
        let left = ((index + 1 - perv) * 160).toString();
        let top = row > 1 ? ((row - 1) * 100).toString() : 0;
        liElement.style.left = Number(left).toString() + "px";
        liElement.style.top = (Number(top) + 20).toString() + "px";

        liElement.style.width = "140px";
        liElement.style.height = "80px";
      } else {
        if (table.XPosition && table.YPosition) {
          let left = table.XPosition.replace("px", "");
          let top = table.YPosition.replace("px", "");
          liElement.style.left = (Number(left) - 15).toString() + "px";
          liElement.style.top = (Number(top) - 46.986114501953125).toString() + "px";
        }
        liElement.style.width = table.Width;
        liElement.style.height = table.Height;
      }

      // let divElementText = document.createTextNode('Dynamically created div element');
      // divElement.appendChild(divElementText);
      //ULselected.appendChild(liElement);
    }, 50);
  }

  deleteItem() {
    if (this.filtredTables[this.val]) {
      this.filtredTables.splice(this.val, 1);
    }
  }

  checkAnotherCaptainOrUser(o = null) {
    if (!o) o = this.filtredTables[this.val];
    if (
      o &&
      o.Count > 0 &&
      this.orderObj &&
      this.orderObj.pointOfSale &&
      this.orderObj.pointOfSale.IsHallPos &&
      (this.orderObj.settings.CanNotEditOrderByAnother ||
        this.orderObj.validationList["CanNotEditOrderForAnotherUser"]) &&
      this.orderObj.CaptainDocumentId != o.CaptainDocumentId
    ) {
      return false;
    } else if (
      o &&
      o.Count > 0 &&
      this.orderObj.pointOfSale &&
      !this.orderObj.pointOfSale.IsHallPos &&
      this.orderObj.settings &&
      (this.orderObj.settings.CanNotEditOrderByAnother ||
        this.orderObj.validationList["CanNotEditOrderForAnotherUser"]) &&
      this.orderObj.appUserId != o.CreatorUserId
    ) {
      return false;
    } else return true;
  }

  clickLi(e) {
    this.val = e;
    if (!this.checkAnotherCaptainOrUser()) {
      let table = this.filtredTables[this.val];
      this.toastr.info(this.translate.instant("messages.TableUsedByAnotherUser") + " " + table.CashierName);
    } else if (!this.SideMenu) {
      this.cancel();
    }
    if(this.orderObj.settings?.UseMinimumCharge && this.val >= 0 && this.filtredTables?.length && this.filtredTables[this.val]?.ValuePerPerson)
      this.orderObj.MinimumChargeNewPerPerson = this.filtredTables[this.val].ValuePerPerson;

    this.customerOrderService.getCustomerOrdersCount().subscribe({
      next: (res) => {
        this._OrderComponent.ReservationsCount = res;
      }
    });
  }

  ClickedTable(e) {
    // for(let i =0 ; i< this.matches.length ; i++){
    //   this.matches.item(i).classList.add('BorderRadius')
    // }
  }

  printTableQr() {
    // debugger
    if (this.Url && (this.val || this.val == 0)) {
      let table = this.filtredTables[this.val];
      table.URL = this.Url;
      this.hallServ.PrintTableQrCode(table).subscribe((res) => {
        this.report.loadDocument(res);
        // Render report
        this.report.renderAsync();

        // Create an HTML settings instance. You can change export settings.
        var settings = new Stimulsoft.Report.Export.StiHtmlExportSettings();
        // Create an HTML service instance.
        var service = new Stimulsoft.Report.Export.StiHtmlExportService();
        // Create a text writer objects.
        var textWriter = new Stimulsoft.System.IO.TextWriter();
        var htmlTextWriter = new Stimulsoft.Report.Export.StiHtmlTextWriter(textWriter);
        // Export HTML using text writer.
        service.exportTo(this.report, htmlTextWriter, settings);
        //  var contents =(<HTMLInputElement>document.getElementById("FrameDIv")).innerHTML;
        var frame1 = document.createElement("iframe");
        frame1.name = "frame1";
        frame1.style.position = "absolute";
        frame1.style.top = "-1000000px";
        document.body.appendChild(frame1);
        var frameDoc =
          (<HTMLIFrameElement>frame1).contentDocument || (<HTMLIFrameElement>frame1).contentWindow.document;
        frameDoc.open();
        frameDoc.write("</head><body>");
        frameDoc.write(textWriter.getStringBuilder().toString());
        frameDoc.write("</body></html>");
        frameDoc.close();
        setTimeout(function () {
          window.frames["frame1"].focus();
          window.frames["frame1"].print();
          document.body.removeChild(frame1);
        }, 500);
        return false;
      });
    }
  }

  public tileRender(args: PaletteTileEventArgs): void {
    addClass([args.element], ["e-icons", "e-custom-tile"]);
  }

  // Triggers while selecting colors from palette.
  public onChange(args: ColorPickerEventArgs): void {
    let ULselected = document.getElementById(this.dataTab);
    let liSelected = ULselected.getElementsByTagName("li")[this.val];
    liSelected.style.backgroundColor = args.currentValue.hex;
    this.setStyleToElement(this.val);
  }

  // Triggers before rendering each palette tile.
  public customColors: { [key: string]: string[] } = {
    custom1: [
      "#ef9a9a",
      "#f48fb1",
      "#f06292",
      "#ec407a",
      "#ce93d8",
      "#ba68c8",
      "#ab47bc",
      "#9c27b0",
      "#b39ddb",
      "#9575cd"
    ],
    custom2: [
      "#7e57c2",
      "#673AB7",
      "#9FA8DA",
      "#7986CB",
      "#5C6BC0",
      "#3F51B5",
      "#90CAF9",
      "#64B5F6",
      "#80DEEA",
      "#4DD0E1"
    ],
    custom3: [
      "#26C6DA",
      "#00BCD4",
      "#80CBC4",
      "#4DB6AC",
      "#26A69A",
      "#009688",
      "#A5D6A7",
      "#81C784",
      "#66BB6A",
      "#4CAF50"
    ],
    custom4: [
      "#C5E1A5",
      "#AED581",
      "#9CCC65",
      "#8BC34A",
      "#E6EE9C",
      "#DCE775",
      "#D4E157",
      "#CDDC39",
      "#FFE171",
      "#FFCA80"
    ]
  };

  onDragEnd(event, index) {
    this.setStyleToElement(index);
  }

  onDragBegin($event, i) {
    this.val = i;
    // debugger
    /*if (!this.SideMenu && this.checkAnotherCaptainOrUser()) this.clickLi(i);*/
  }

  onResizeStop(event, i) {
    if (this.SideMenu) this.setStyleToElement(i);
  }

  setStyleToElement(index) {
    let element = document.getElementById("liDrag" + index.toString() + this.dataTab.toString());
    document.getElementById("liDrag" + index.toString() + this.dataTab.toString()).style.position = "absolute";

    if (element) {
      let selected = element;

      var boundingRectangle = selected.getBoundingClientRect();

      let y_elem = (selected.offsetHeight - (boundingRectangle.bottom - boundingRectangle.top)) / 2;
      let x_elem = (selected.offsetWidth - (boundingRectangle.right - boundingRectangle.left)) / 2;

      let half_elem_height = (boundingRectangle.bottom - boundingRectangle.top) / 2;
      let half_elem_width = (boundingRectangle.right - boundingRectangle.left) / 2;

      let table = this.filtredTables[index];
      const style = window.getComputedStyle(element);
      // element.style.transformOrigin = "0px 0px";
      // style.transformOrigin = "0px 0px";
      //table.Transform = style.transform || style.webkitTransform ;
      table.Transform = element.style.transform;
      var newXY = element.style.transform
        .replace("translate", "")
        .replace(")", "")
        .replace("(", "")
        .replace(",", "")
        .replace("px", "")
        .replace("px", "")
        .split(" ");
      var oldXY = style.transformOrigin
        .replace("translate", "")
        .replace(")", "")
        .replace("(", "")
        .replace(",", "")
        .replace("px", "")
        .replace("px", "")
        .split(" ");
      table.Color = style.backgroundColor;
      const border = style.border;
      const position = style.position;
      const right = style.right;
      const bottom = style.bottom;
      var matrix = new WebKitCSSMatrix(style.transform);
      // table.XPosition = (Number(oldXY[0]) + Number(newXY[0])).toString()+'px';
      // table.YPosition = (Number(oldXY[1]) + Number(newXY[1])).toString()+'px';
      table.XPosition = boundingRectangle.left.toString() + "px";
      table.YPosition = boundingRectangle.top.toString() + "px";
      table.Width = style.width;
      table.Height = style.height;
      table.Shape = style.borderRadius;
    }
  }

  cancel(game = undefined) {
    // debugger
    const table = this.filtredTables[this.val];
    table.Name += (table.perviewName ? '/' + table.perviewName : '');
    if(!game) this.CloseDin.emit(table);
    else{
      game.table = table;
      this.CloseDinAndAddGame.emit(game);
    } 
  }

  onResizeStart(i, event) {
    /*if (!this.SideMenu && this.checkAnotherCaptainOrUser()) this.clickLi(i);*/
  }

  //#region Edit Table
  openEditTablePopUp() {
    if (this.filtredTables[this.val]) {
      this.TableNameText = !this.TableNameText;
      this.TableName = this.filtredTables[this.val].Name;
      this.TableName = this.filtredTables[this.val].Name;

      // $("#modal-EditTable").modal("show");
    }
  }

  /**
   * Showing customer order adding dialog
   */
  @ViewChild(BsDropdownDirective) dropdown: BsDropdownDirective;
  
  // Table history modal properties
  showTableHistoryModal = false;
  tableHistoryData: any[] = [];
  isLoadingTableHistory = false;
  selectedTableIndex: number = -1;

  openTableHistory(event: MouseEvent, tableIndex: number) {
    event.stopPropagation();
    this.selectedTableIndex = tableIndex;
    if (this.selectedTableIndex === -1) return;
    
    this.isLoadingTableHistory = true;
    const tableId = this.filtredTables[this.selectedTableIndex]?.DocumentId;
    
    if (!tableId) {
      console.error('Table ID is missing');
      this.isLoadingTableHistory = false;
      return;
    }
    this.orderService.getTableHistory(tableId).subscribe((res:any[]) => {
      this.tableHistoryData = res;
      this.showTableHistoryModal = true;
      this.isLoadingTableHistory = false;
    });
  }
  
  formatDateTime(date: Date): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  }
  
  closeTableHistoryModal() {
    this.showTableHistoryModal = false;
    this.tableHistoryData = [];
    this.selectedTableIndex = -1;
  }

  stopPropagation(event: MouseEvent) {
    event.stopPropagation();
  }

  customerOrderReservation(event: MouseEvent, tableIndex: number) {
    this.stopPropagation(event);

    // Show customer order form
    const reservationModalRef = this.modalService.show(CustomerReservationComponent, {
      class: "modal-lg",
      initialState: {
        orderObj: this.orderObj,
        table: this.filtredTables[tableIndex]
      }
    });

    reservationModalRef.onHide.subscribe((reason: any) => {
      const result = reservationModalRef.content.modalResult;

      if (result && result.role == "save") {
        this.toastr.info(this.translate.instant("Order.CustomerOrderInstructions")); // Show user instructions to select products and click send
        this.orderObj.ReservationInfo = result.data; // Set form data into orderobj to use later by send button
        this.orderObj.IsCustomerOrder = true; // Indicate this will be a customer order

        this.val = tableIndex; // Setting table before closing table view
        this.cancel(); // Close table view
      }
    });
  }

  tableGameModal(event: MouseEvent, tableIndex: number, tableInfo: any) {
    event.stopPropagation();

    // Show customer order form
    const tableGameModalRef = this.modalService.show(TableGameComponent, {
      class: "modal-md",
      initialState: {
        orderObj: deepCopy(this.orderObj),
        tableInfo: tableInfo,
        gameList:this.orderService.entertainmentServiceProducts,
        fraction:this.fraction
      }
    });

    tableGameModalRef.onHide.subscribe((reason: any) => {
      const result = tableGameModalRef.content.modalResult;

      if (result && result.role == "save") {
        this.val = tableIndex; // Setting table before closing table view
        this.cancel({
          gameDetails: result.data,
        }); // Close table view
      }
    });
  }

  //#endregion

  get disableEditTables(){
    return this.orderObj && (this.orderObj.settings && this.orderObj.settings.PullAllTablesFromPOS)||(this.orderObj.validationList?.CannotAddAndEditHallsAndTables && !this.orderObj?.isAdmin);
  }

  searchTable(fromInit = false){
    if(this.searchTableName) {
      this.filtredTables = this.currentHall.Tables?.filter(t=> 
        t.Name.toLowerCase().includes(this.searchTableName) || t.TableName?.toLowerCase().includes(this.searchTableName) );
    }
    else
      this.filtredTables = this.currentHall.Tables;

    if(!fromInit){
      this.currentHall.Tables.forEach((table) => {
        this.drowdTable(table);
      });
    }
  }
  openSearchInput(){
    if(this.SideMenu && !this.showSearch)
    {
      // when sideMenue is open  do not open serch
    }
    else
      this.showSearch = !this.showSearch;
    if(!this.showSearch){
      this.searchTableName = '';
      this.searchTable();
    }
    else
      this.setFocusById('searchTableName'+this.currentHall.Name);
 }


 setFocusById(elemId) {
  window.setTimeout(function () {
    let elem = document.getElementById(elemId);
    if (elem) elem.focus();
  }, 200);
}
openEditTableNameForPerview(event: MouseEvent, tableIndex) {
  if (this.orderObj?.settings?.CanChangeTableNameInOrder && this.filtredTables[tableIndex] && !this.filtredTables[tableIndex].Count){
    event.stopPropagation();
    this.editTableNameForPerview = !this.editTableNameForPerview;
    this.val = tableIndex;
  }
}
showTableGame(table) {
  return this.currentHall?.ServeEntertainmentServices && (!this.orderObj.DocumentId || (this.orderObj.DocumentId && table.DocumentId == this.orderObj.TableId));
}
arrangeAllTablesForHall(){
  const tablesPerRow = 6; // Number of tables per row
 
  this.currentHall?.Tables?.forEach((table , index) => {
    const row = Math.floor(index / tablesPerRow);
    const newXPosition = 18 + (index % tablesPerRow) * 247; 
    const newYPosition = 48 + row * 120;
    // Increment table index
    table.Shape ="5px";
    table.Transform ="translate(232px, 1px)";
    table.XPosition =newXPosition + "px";
    table.YPosition =newYPosition + "px";
    table.Width ="220px";
    table.Height ="110px";
    this.drowdTable(table);
  });
  this.currentHall?.Tables?.forEach((table , index) => {
    this.drowdTable(table);
  });
}

}
