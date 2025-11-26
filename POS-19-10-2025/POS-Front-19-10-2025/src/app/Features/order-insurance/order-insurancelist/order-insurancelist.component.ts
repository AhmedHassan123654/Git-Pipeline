import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import * as imp from "../orderInsuranceimport";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
@Component({
  selector: "app-order-insurancelist",
  templateUrl: "./order-insurancelist.component.html",
  styleUrls: ["./order-insurancelist.component.scss"]
})
export class OrderInsurancelistComponent extends imp.GeneralGrid implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("Grid", { static: false }) grid: imp.GridComponent;
  @ViewChild("searchKeyList", { static: false }) searchKeyList: ElementRef;

  //#endregion

  //#region Constructor
  constructor(
    public orderInsuranceSer: imp.OrderInsuranceService,
    public toast: imp.ToastrService,
    public messages: imp.HandlingBackMessages,
    public SettingSer: imp.SettingService,
    public Router: imp.Router,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private general: imp.general
  ) {
    super(toast, messages, SettingSer, Router);
    this.initializeobjects();
  }
  //#endregion
  //#region Angular Life Cycle
  ngOnInit(): void {
    this.GetGrideList().subscribe(() => {
      this.toolbarList = [];
      // if (this.showNew) {
      //   this.toolbarList.push({
      //     text: "Add",
      //     tooltipText: "Add",
      //     prefixIcon: "e-add",
      //     id: "Add"
      //   });
      // }
      if (this.showView)
        this.toolbarList.push({
          text: "",
          tooltipText: "View",
          prefixIcon: "e-view",
          id: "View"
        });
      if (this.showEdit)
        this.toolbarList.push({
          text: "",
          tooltipText: "Edit",
          prefixIcon: "e-edit",
          id: "Edit"
        });
      if (this.showDelete)
        this.toolbarList.push({
          text: "",
          tooltipText: "Delete",
          prefixIcon: "e-delete",
          id: "Delete"
        });
      if (this.showPrint)
        this.toolbarList.push({
          text: "",
          tooltipText: "Print",
          prefixIcon: "e-print",
          id: "Print"
        });
      this.toolbarOptions = this.toolbarList;
      this.dataList = this.general.deepCopy(this?.responseobj?.List);
      if (this.settings?.OrderInsuranceHideList) {
        this.responseobj.List = [];
      }
    });
    this.initializeGrid();
    setTimeout(() => {
      this.DisabledGridButton();
    }, 300);
  }

  //#endregion

  //#region CashReceiptList Methods

  initializeobjects(): void {
    this.responseobj = {};
    this.rowData = {};
    this.service = this.orderInsuranceSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/OrderInsurance";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.SettingSer.GetSetting().subscribe((res) => {
      if (res) {
        this.settings = res;
      }
    });
  }
  MakeReturnInsurance(data) {
    data.currentAction = "Add";
    data.secondcurrentAction = "AddFromOrder";
    this.router.navigateByUrl("returnInsurances", data);
  }
  ngAfterViewInit() {
    // Focus the input element after the view has been initialized
    this.searchKeyList?.nativeElement?.focus();
  }
  filterList(searchterm: any) {
    if (!searchterm.key) this.searchKey = undefined;
    if (searchterm.target.value && searchterm.key) {
      if (Number(searchterm.target.value) >= 0) {
        //search by phone Or Serial Number
        this.responseobj.List = this.dataList.filter(
          (x) =>
            x?.CustomerPhone?.includes(searchterm.target.value) || x.SerialNumber === Number(searchterm.target.value)
        );
      } else {
        //search by name
        this.responseobj.List = this.dataList.filter((x) =>
          x?.CustomerName?.toLowerCase().includes(searchterm.target.value.toLowerCase())
        );
      }
    } else {
      this.responseobj.List = this.dataList;
    }
  }
  filterListFromBtn(searchterm: any) {
    // if (searchterm && Number(searchterm) >= 0)
      this.responseobj.List = this.dataList.filter((x) =>
         x?.CustomerPhone == searchterm ||
      x?.CustomerName?.toLowerCase() == searchterm.toLowerCase()
    );
    // else {
      //search by name
      // this.responseobj.List = this.dataList.filter((x) => x?.CustomerName?.toLowerCase() == searchterm.toLowerCase());
    // }
  }

  rowData: any;
  deleteFromGrideList(data: any): void {
    this.orderInsuranceSer.Transactions(this.rowData, "Delete").subscribe((res) => {
      if (res == 3) {
        this.responseobj.List = this.responseobj?.List?.filter((x) => x.DocumentId !== this.rowData.DocumentId);
        this.dataList = this.dataList?.filter((x) => x.DocumentId !== this.rowData.DocumentId);
        this.toastr.warning(this.toastrMessage.GlobalMessages(res));
        this.grid?.refresh();
      } else {
        this.toastr.error(this.toastrMessage.GlobalMessages(res));
      }
    });
  }

  onRowSelected(args: imp.RowSelectEventArgs): void {
    this.rowData = args?.data?.valueOf();
  }
  toolbarClick(args: imp.ClickEventArgs) {
    if (this.rowData && Object.keys(this.rowData).length > 0) {
      switch (args?.item?.id) {
        case "Edit":
          this.rowData.currentAction = "Edit";
          this.editButtonAction();
          break;

        case "View":
          this.rowData.currentAction = "View";
          this.viewButtonAction();
          break;

        case "Delete":
          this.deleteButtonAction();
          break;

        case "Print":
          this.printButtonAction();
          break;

        case "customButton1":
          this.customButton1Action();
          break;

        case "ExcelExport":
          this.grid.excelExport();
          break;

        case "Word":
          this.wordexport();
          break;

        case "PDF":
          break;

        default:
          break;
      }
    }
  }
}
