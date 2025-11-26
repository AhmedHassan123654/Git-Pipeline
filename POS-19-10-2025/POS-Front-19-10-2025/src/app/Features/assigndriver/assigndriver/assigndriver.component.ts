import { Component, OnInit, ViewChild } from "@angular/core";
import { CommandModel, GridComponent } from "@syncfusion/ej2-angular-grids";
import { ToastrService } from "ngx-toastr";
import { OrderModel } from "src/app/core/Models/order/orderModel";
import { DriverModel } from "src/app/core/Models/Transactions/DriverModel";
import { CustomerAddressModel } from "src/app/core/Models/Transactions/CustomerAddressModel";
import { AssignDriverModel } from "src/app/core/Models/Transactions/AssignDriverModel";
import { AssignDriverService } from "src/app/core/Services/Transactions/assigndriver";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
declare var $: any;
@Component({
  selector: "app-assigndriver",
  templateUrl: "./assigndriver.component.html",
  styleUrls: ["./assigndriver.component.css"]
})
export class AssigndriverComponent implements OnInit {
  [key: string]: any;
  config: any;
  assignDriver: AssignDriverModel = new AssignDriverModel();
  assignDriverUpdate: AssignDriverModel = new AssignDriverModel();
  orderlist: OrderModel[] = [];
  selectOrderlist: OrderModel[] = [];
  orderDriverlist: OrderModel[] = [];
  driverlist: DriverModel[] = [];
  driverInlist: DriverModel[] = [];
  driverOutlist: DriverModel[] = [];
  commands: CommandModel[];
  CustomerAddress: CustomerAddressModel = new CustomerAddressModel();
  GrandTotal: number;
  currentDriver: DriverModel;
  comboboxPrinterlist: any;
  comboboxPrinterfields: Object = {};
  selectPrinter: string;
  @ViewChild("orderlistgrid") orderlistgrid: GridComponent;
  constructor(
    private assignDriverSer: AssignDriverService,
    private toastr: ToastrService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    this.commands = [
      {
        buttonOption: {
          content: "Details",
          cssClass: "btn btn-success editBBtN"
        }
      }
    ];
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  ngOnInit() {
    this.firstOpen();
  }

  firstOpen() {
    this.assignDriverSer.FirstOpen().subscribe((res) => {
      this.assignDriver = res as AssignDriverModel;
      if (this.assignDriver != null) {
        this.orderlist = this.assignDriver.OrderModels;
        this.driverInlist = this.assignDriver.DriverModels.filter((d) => !d.isOut).sort(
          (a, b) => a.MaxOrders - b.MaxOrders
        );
        this.driverOutlist = this.assignDriver.DriverModels.filter((d) => d.isOut);
        this.comboboxPrinterlist = this.assignDriver.NetworkPrinterDropDownModels;
      }
    });
    this.comboboxPrinterfields = { text: "Name", value: "Name" };
  }

  ShowOrders(driver: DriverModel) {
    this.currentDriver = driver;
    this.assignDriverSer.GetOrderByDriverId(driver.DocumentId).subscribe((res) => {
      this.orderDriverlist = res as OrderModel[];
      this.calculateGrandTotal();
    });
  }

  SelectOrder(event) {
    let row: HTMLTableRowElement = event.target.parentNode.parentNode.parentNode;
    let rowIndex = +row.getAttribute("aria-rowindex");
    this.orderlistgrid.selectRow(rowIndex);
    let record = this.orderlistgrid.getSelectedRecords()[0];
    this.selectOrderlist.push(record as OrderModel);
  }

  ShowAddress(event) {
    let row: HTMLTableRowElement = event.target.parentNode.parentNode.parentNode;
    let rowIndex = +row.getAttribute("aria-rowindex");
    this.orderlistgrid.selectRow(rowIndex);
    let record = this.orderlistgrid.getSelectedRecords()[0];
    this.CustomerAddress = (record as OrderModel).CustomerAddress;
  }

  AssignToDriver(driver: DriverModel) {
    this.assignDriverUpdate = new AssignDriverModel();
    this.assignDriverUpdate.DriverModels = [];
    if (this.selectOrderlist.length > 0) {
      driver.MaxOrders += this.selectOrderlist.length;
      this.assignDriverUpdate.DriverModels.push(driver);
      this.selectOrderlist.forEach((element) => {
        element.DriverDocumentId = driver.DocumentId;
        element.DriverId = driver.Id;
        element.DriverName = driver.DriverName;
      });
      this.assignDriverUpdate.OrderModels = this.selectOrderlist;
      this.assignDriverSer.UpdateOrderAndDriver(this.assignDriverUpdate).subscribe((res) => {
        this.firstOpen();
      });
    }
  }

  ExitDriver(driver: DriverModel, index: number) {
    if (driver.MaxOrders != 0) {
      driver.isOut = true;
      this.assignDriverSer.UpdateDriver(driver).subscribe((res) => {
        this.driverInlist.splice(index, 1);
        this.driverOutlist.push(driver);
      });
    } else {
      this.toastr.error("Should Assign Order First", "Assign Driver");
    }
  }

  ReturnDriver(OutDriver: DriverModel, index: number) {
    OutDriver.isOut = false;
    this.assignDriverSer.UpdateDriver(OutDriver).subscribe((res) => {
      this.driverOutlist.splice(index, 1);
      this.driverInlist.push(OutDriver);
    });
  }

  calculateGrandTotal() {
    this.GrandTotal = 0;
    this.orderDriverlist.forEach((element) => {
      this.GrandTotal += element.SubTotal;
    });
  }

  unAssignToDriver(order: OrderModel, index: number) {
    this.assignDriverUpdate = new AssignDriverModel();
    this.assignDriverUpdate.DriverModels = [];
    this.assignDriverUpdate.OrderModels = [];
    this.currentDriver.MaxOrders -= 1;
    this.assignDriverUpdate.DriverModels.push(this.currentDriver);
    order.DriverId = null;
    order.DriverName = null;
    this.assignDriverUpdate.OrderModels.push(order);
    this.assignDriverSer.UpdateOrderAndDriver(this.assignDriverUpdate).subscribe((res) => {
      this.orderDriverlist.splice(index, 1);
      this.firstOpen();
      this.calculateGrandTotal();
    });
  }

  ReceiveOrder(order: OrderModel, index: number) {
    this.assignDriverUpdate = new AssignDriverModel();
    this.assignDriverUpdate.OrderModels = [];
    this.assignDriverUpdate.OrderModels.push(order);
    this.ReceviceOrders();
    this.assignDriverSer.UpdateOrderAndDriver(this.assignDriverUpdate).subscribe(async (res) => {
      this.orderDriverlist.splice(index, 1);
      this.calculateGrandTotal();
    });
  }

  ReceviceOrders() {
    this.assignDriverUpdate.DriverModels = [];
    this.assignDriverUpdate.OrderModels.forEach((element) => {
      this.currentDriver.MaxOrders -= 1;
      element.Paid = true;
    });
    this.assignDriverUpdate.DriverModels.push(this.currentDriver);
  }

  ReceiveAllOrder() {
    this.assignDriverUpdate = new AssignDriverModel();
    $("#modal-RecieveOrders").modal("hide");
    if (this.orderDriverlist.length > 0) {
      this.assignDriverUpdate.OrderModels = this.orderDriverlist;
      this.ReceviceOrders();
      this.assignDriverSer.UpdateOrderAndDriver(this.assignDriverUpdate).subscribe(async (res) => {
        this.orderDriverlist = [];
        this.GrandTotal = 0;
      });
    }
    this.driverInlist = this.driverInlist.filter((d) => !d.isOut).sort((a, b) => a.MaxOrders - b.MaxOrders);
  }

  checkPrinter() {
    if (this.selectPrinter) {
      if (this.comboboxPrinterlist.findIndex((x) => x.Name == this.selectPrinter) == -1) this.selectPrinter = null;
    }
  }
}
