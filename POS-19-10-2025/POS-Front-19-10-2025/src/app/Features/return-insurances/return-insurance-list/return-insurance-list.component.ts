import * as imp from "../return-insurance-import";
import { Component, ElementRef, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
@Component({
  selector: "app-return-insurance-list",
  templateUrl: "./return-insurance-list.component.html",
  styleUrls: ["./return-insurance-list.component.scss"]
})
export class ReturnInsuranceListComponent extends imp.GeneralGrid implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("Grid", { static: false }) grid: imp.GridComponent;
  @ViewChild("returnSearchKeyList", { static: false }) returnSearchKeyList: ElementRef;

  //#endregion

  //#region Constructor
  constructor(
    public returnOrderInsuranceSer: imp.ReturnOrderInsuranceService,
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
  //#endregion
  //#region Angular Life Cycle
  ngOnInit(): void {
    this.GetGrideList().subscribe(() => {
      this.toolbarList = [];
      if (this.showNew) {
        this.toolbarList.push({
          text: "Add",
          tooltipText: "Add",
          prefixIcon: "e-add",
          id: "Add"
        });
      }
      if (this.showView)
        this.toolbarList.push({
          text: "",
          tooltipText: "View",
          prefixIcon: "e-view",
          id: "View"
        });
      /*   if(this.showEdit)
    this.toolbarList.push({ text: '', tooltipText: 'Edit', prefixIcon: 'e-edit', id: "Edit" }); */
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
    this.service = this.returnOrderInsuranceSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/returnInsurances";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  ngAfterViewInit() {
    // Focus the input element after the view has been initialized
    this.returnSearchKeyList?.nativeElement?.focus();
  }
  filterList(searchterm: any) {
    if (!searchterm.key) this.returnSearchKey = undefined;
    if (searchterm.target.value && searchterm.key) {
      if (Number(searchterm.target.value) >= 0) {
        //search by phone Or Serial Number
        this.responseobj.List = this.dataList.filter(
          (x) =>
            x?.OrderInsuranceCustomerPhone?.includes(searchterm.target.value) || x.OrderInsuranceNumber === Number(searchterm.target.value)
        );
      } else {
        //search by name
        this.responseobj.List = this.dataList.filter((x) =>
          x?.OrderInsuranceCustomer?.toLowerCase().includes(searchterm.target.value.toLowerCase())
        );
      }
    } else {
      this.responseobj.List = this.dataList;
    }
  }
}
