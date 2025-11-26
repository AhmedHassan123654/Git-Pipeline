import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../ordertypeimpots";

@Component({
  selector: "app-order-types",
  templateUrl: "./order-types.component.html",
  styleUrls: ["./order-types.component.scss"]
})
export class OrderTypesComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  public OrderTypeList: any[] = [
    { Id: 1, Name: "TakeAway" },
    { Id: 2, Name: "Delivery" },
    { Id: 4, Name: "DineIn" }
  ];
  public Flds = { text: "Name", value: "Id" };
  public CompoFlag: boolean = false;
  public breakSave: boolean = false;
  //#endregion
  constructor(
    public OrderTypeSer: imp.OrderTypeService,
    public toastr: imp.ToastrService,
    public toastrMessage: imp.HandlingBackMessages,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private router: imp.Router
  ) {
    super();
    this.initializeobjects();
  }
  ngOnInit(): void {
    this.GetAllOrderTypeTaxex();

    this.GetAllPrinters();
    //

    if (this.request.PageNumber != null) {
      this.scrFirstOpen().subscribe(() => {
        this.responseobj.screenPermission.Print = false;
        if (this.responseobj.IsHasDiscount == true) {
          this.showDiscount = true;
          this.CompoFlag = true;
        } else {
          this.showDiscount = false;
        }
        this.responseobj.TaxeIDs = [];
        this.responseobj.Taxes.forEach((item) => {
          this.responseobj.TaxeIDs.push(item.TaxDocumentId);
        });
      });
    } else {
      this.scrFirstOpen().subscribe(() => {
        this.responseobj.screenPermission.Print = false;
        if (this.responseobj.IsHasDiscount == true) {
          this.showDiscount = true;
        } else {
          this.showDiscount = false;
        }
        this.responseobj.TaxeIDs = [];
        this.responseobj.Taxes.forEach((item) => {
          this.responseobj.TaxeIDs.push(item.TaxDocumentId);
        });
      });
    }
  }
  //#region CashReceipt Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.OrderTypeSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#endregion
  GetAllOrderTypeTaxex() {
    this.OrderTypeSer.GetOrderTypeTaxes().subscribe((res) => {
      this.OrderTypeTaxesList = res as any;
      this.OrderTypeTaxFlds = { text: "nameTax", value: "TaxDocumentId" };
    });
  }
  GetAllPrinters() {
    this.OrderTypeSer.GetAllprinters().subscribe((res) => {
      this.PrinterList = res as any;
      this.PrinterFlds = { text: "name", value: "name" };
    });
  }
  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    debugger
    switch (event) {
      case imp.quickAction.afterNew:
        debugger
        this.GetAllOrderTypeTaxex();
        this.preAddUpdate({});
        this.showDiscount = false;
        this.responseobj.Id = null;
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd();
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
        break;
      case imp.quickAction.beforeAdd:
        this.beforeinsert();
        break;
      case imp.quickAction.beforeUpdate:
        this.beforeUpdate();
        break;
      case imp.quickAction.afterUndo:
        if (this.responseobj.IsHasDiscount == true) {
          this.showDiscount = true;
          this.CompoFlag = false;
        } else {
          this.showDiscount = false;
        }
        break;
    }
  }
  //#endregion

  //#region Pagger
  afterPag(event: any): void {
    this.formPaging({ formObj: event });
    this.responseobj.TaxeIDs = [];
    event.Taxes.forEach((item) => {
      this.responseobj.TaxeIDs.push(item.TaxDocumentId);
    });
    if (event.IsHasDiscount == true) {
      this.showDiscount = true;
    } else {
      this.showDiscount = false;
    }
  }
  //#endregion
  show(event: any) {
    this.CompoFlag = true;

    this.showDiscount = event.checked;
  }
  keyFunc(event: any) {
    let num = parseInt(event.target.value);
    if (num > 100) {
      this.breakSave = true;

      this.toastr.error(this.toastrMessage.GlobalMessages(24));
    } else {
      this.breakSave = false;
    }
  }
  beforeinsert() {
    /*   if(this.responseobj != undefined && (this.responseobj.WillBeUsedForMobileApp ==null ||this.responseobj.WillBeUsedForMobileApp ==undefined) ){
    this.responseobj.WillBeUsedForMobileApp=false;
   }
   if(this.responseobj != undefined && (this.responseobj.SelectWaiterInOrder ==null ||this.responseobj.SelectWaiterInOrder ==undefined) ){
    this.responseobj.SelectWaiterInOrder=false;
   }
   if(this.responseobj != undefined && (this.responseobj.NoteIsRequired ==null ||this.responseobj.NoteIsRequired ==undefined) ){
    this.responseobj.WillBeUsedForMobileApp=false;
   }
   if(this.responseobj != undefined && (this.responseobj.WillBeUsedForMobileApp ==null ||this.responseobj.WillBeUsedForMobileApp ==undefined) ){
    this.responseobj.WillBeUsedForMobileApp=false;
   }
   if(this.responseobj != undefined && (this.responseobj.WillBeUsedForMobileApp ==null ||this.responseobj.WillBeUsedForMobileApp ==undefined) ){
    this.responseobj.WillBeUsedForMobileApp=false;
   }
   if(this.responseobj != undefined && (this.responseobj.WillBeUsedForMobileApp ==null ||this.responseobj.WillBeUsedForMobileApp ==undefined) ){
    this.responseobj.WillBeUsedForMobileApp=false;
   }
   if(this.responseobj != undefined && (this.responseobj.WillBeUsedForMobileApp ==null ||this.responseobj.WillBeUsedForMobileApp ==undefined) ){
    this.responseobj.WillBeUsedForMobileApp=false;
   } */
    let newtaxes = Array<imp.OrderTypeTaxModel>();
    if (this.responseobj.TaxeIDs != undefined && this.responseobj.TaxeIDs != null) {
      this.responseobj.TaxeIDs.forEach((item) => {
        let taxObj = new imp.OrderTypeTaxModel();
        taxObj.TaxDocumentId = item;
        newtaxes.push(taxObj);
      });
    }

    this.responseobj.Taxes = newtaxes;
  }
  beforeUpdate() {
    let newtaxes = Array<imp.OrderTypeTaxModel>();
    if (this.responseobj.TaxeIDs != undefined && this.responseobj.TaxeIDs != null) {
      this.responseobj.TaxeIDs.forEach((item) => {
        let taxObj = new imp.OrderTypeTaxModel();
        taxObj.TaxDocumentId = item;
        newtaxes.push(taxObj);
      });
      this.responseobj.Taxes = newtaxes;
    }
  }
}
