import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { ActivatedRoute } from "@angular/router";
import * as imp from "../extraexpensis";
import {
  ClickEventArgs,
  general
} from "src/app/shared/Imports/featureimports";
import { Guid } from "guid-typescript";

declare var $: any;

@Component({
  selector: "app-extraexpenses",
  templateUrl: "./extraexpenses.component.html",
  styleUrls: ["./extraexpenses.component.css"]
})
export class ExtraexpensesComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  //#endregion

  //#region Constructor
  constructor(
    public ExtraExpensesSer: imp.ExtraExpensesService,
    private toastrMessage: imp.HandlingBackMessages,
    private toastr: imp.ToastrService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private router: imp.Router,
    private _ActivatedRoute: ActivatedRoute
  ) {
    super();
    if (this._ActivatedRoute.snapshot.data[0] === "extraexpenses") {
      this.ExtraExpensesSer.isExtraExpenses.next(true);
    } else {
      this.ExtraExpensesSer.isExtraExpenses.next(false);
    }
    this.initializeobjects();
    this.pageNumber = this.router.getCurrentNavigation().extras as number;

    // document.addEventListener('keydown', function(event) {
    //   if (event.key === 'Enter') {
    //     event.preventDefault(); // Prevent form submission or other default actions

    //     // Get the currently focused element
    //     const focusedElement = document.activeElement;

    //     // Check if the focused element is an input or textarea
    //     if (focusedElement.tagName === 'INPUT' || focusedElement.tagName === 'TEXTAREA') {
    //       // Find all input elements within the form
    //       const inputs = Array.from(document.querySelectorAll('#myForm input, #myForm textarea')) as any;

    //       // Get the index of the currently focused input
    //       const index = inputs.indexOf(focusedElement);

    //       // Focus the next input, if it exists
    //       if (index !== -1 && index < inputs.length - 1) {
    //         inputs[index + 1].focus();
    //       }
    //     }
    //   }
    // });

  }
  //#endregion
  //#region CashReceipt Methods
  initializeobjects(): void {
    this.payFlds = { text: "Name", value: "DocumentId" };
    this.responseobj = {};
    this.service = this.ExtraExpensesSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.VendorCompo = false;
    this.EmpCompo = false;
    this.disabledflage = false;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#endregion
  //#region Angular Life Cycle
  extraFirstOpen() {
    this.ExtraExpensesSer.extraFirstOpen().subscribe((res: any) => {
      this.orderPayTypes = res.orderPayTypes;
    });
  }
  ngOnInit() {
    this.extraFirstOpen();
    if (this.request.currentAction == "Edit") {
      this.scrFirstOpen().subscribe(() => {
        this.editeFromGridSubject();
      });
    } else if (this.request.currentAction == "View") {
      this.scrFirstOpen().subscribe(() => {
        this.ViewFromGridSubject();
      });
    } else if (this.request.currentAction == "Add") {
      this.scrFirstOpen().subscribe(() => {
        this.responseobj.Date = new Date();
      });
    } else {
      this.scrFirstOpen().subscribe(() => {
        if (this.responseobj.ExtraExpensesTypeDetail == 1) {
          this.VendorCompo = false;
          this.EmpCompo = false;
        }
        if (this.responseobj.ExtraExpensesTypeDetail == 2) {
          this.VendorCompo = false;
          this.EmpCompo = true;
        }
        if (this.responseobj.ExtraExpensesTypeDetail == 3) {
          this.VendorCompo = true;
          this.EmpCompo = false;
        }
      });
    }
  }

  //#endregion

  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
    if (this.responseobj.ExtraExpensesTypeDetail == 1) {
      this.VendorCompo = false;
      this.EmpCompo = false;
    }
    if (this.responseobj.ExtraExpensesTypeDetail == 2) {
      this.VendorCompo = false;
      this.EmpCompo = true;
    }
    if (this.responseobj.ExtraExpensesTypeDetail == 3) {
      this.VendorCompo = true;
      this.EmpCompo = false;
    }
  }
  setFocusById(elemId) {
    let elem = document.getElementById(elemId);
    if (elem) document.getElementById(elemId).focus();
  }
  quickEvents(event: imp.quickAction): void {
    if (this.responseobj && !this.responseobj.SerialUUID) this.responseobj.SerialUUID = Guid.create().toString();
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({ dateFields: ["Date"] }).subscribe(() => {
          this.VendorCompo = false;
          this.EmpCompo = false;
          this.disabledflage = true;
          this.responseobj.BranchName = this.responsedata.BranchName;
          this.responseobj.BranchId = this.responsedata.BranchId;
          this.setFocusById('amount_id');
        });
        break;
      case imp.quickAction.beforeAdd:
        this.beforeinsert();
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd();
        this.disabledflage = false;
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
        this.disabledflage = true;
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
        break;
      case imp.quickAction.beforeUpdate:
        this.beforeUpdate();
        break;
    }
    if(this.orderPayTypes?.length && this.responseobj && !this.responseobj?.PayTypeDocumentId)
      this.responseobj.PayTypeDocumentId = this.orderPayTypes[0].DocumentId;
  }

  beforeinsert() {
    if (this.responseobj.ExtraExpensesTypeDetail == 1) {
      this.responseobj.ExtraExpensesTypeDetailDocumentId = null;
      this.responseobj.ExtraExpensesTypeDetailId = 0;
    }
    this.checkValidation();
  }
  beforeUpdate() {
    if (this.responseobj.ExtraExpensesTypeDetail == 1) {
      this.responseobj.ExtraExpensesTypeDetailDocumentId = null;
      this.responseobj.ExtraExpensesTypeDetailId = 0;
    }
    this.checkValidation();
  }
  checkValidation(){
    // if (this.orderPayTypes && this.orderPayTypes.length) {
    //   this.responseobj.PayTypeDocumentId = this.orderPayTypes[0].DocumentId;
    // }
    // else{
    //   this.toastr.warning(this.translate.instant("messages.thereIsntCashOrderPayType") );
    //   this.frmRef.form.setErrors({ 'invalid': true });
    //   return;
    // }
  }

  compoCahnge(data) {
    let DocumentID = data.value;
    if (DocumentID == undefined || DocumentID == null) {
      return;
    }
    this.ExtraExpensesSer.VendorOREmp(DocumentID).subscribe((res) => {

      this.data = res as any;
      this.responseobj.ExtraExpensesTypeDetail = this.data.ExtraExpensesTypeDetail;
      this.responseobj.ExtraExpensesTypeDetailDocumentId = null;
      if (this.data.ExtraExpensesTypeDetail == 1) {
        this.EmpCompo = false;
        this.VendorCompo = false;
      }
      if (this.data.ExtraExpensesTypeDetail == 2) {
        this.VendorCompo = false;
        this.EmpCompo = true;
        this.EmpList = this.data.EmpList;
        this.EmpFlds = { text: "FlagName", value: "FlagValue" };
      }
      if (this.data.ExtraExpensesTypeDetail == 3) {
        this.EmpCompo = false;
        this.VendorCompo = true;
        this.VendorList = this.data.VendorList;
        this.VendorFlds = { text: "FlagName", value: "FlagValue" };
      }
    });
  }

  editeFromGridSubject() {
    this.disabledflage = true;
    this.ExtraExpensesTypeList = this.responseobj.ExtraExpensesTypeList;
    this.ExtraExpensesTypeFlds = { text: "FlagName", value: "FlagValue" };
    if (this.responseobj.ExtraExpensesTypeDetail == 1) {
      this.VendorCompo = false;
      this.EmpCompo = false;
    }
    if (this.responseobj.ExtraExpensesTypeDetail == 2) {
      this.VendorCompo = false;
      this.EmpCompo = true;
      this.EmpList = this.responseobj.EmpList;
      this.EmpFlds = { text: "FlagName", value: "FlagValue" };
    }
    if (this.responseobj.ExtraExpensesTypeDetail == 3) {
      this.VendorCompo = true;
      this.EmpCompo = false;
      this.VendorList = this.responseobj.VendorList;
      this.VendorFlds = { text: "FlagName", value: "FlagValue" };
    }
  }

  ViewFromGridSubject() {
    this.disabledflage = false;
    this.ExtraExpensesTypeList = this.responseobj.ExtraExpensesTypeList;
    this.ExtraExpensesTypeFlds = { text: "FlagName", value: "FlagValue" };
    if (this.responseobj.ExtraExpensesTypeDetail == 1) {
      this.VendorCompo = false;
      this.EmpCompo = false;
    }
    if (this.responseobj.ExtraExpensesTypeDetail == 2) {
      this.VendorCompo = false;
      this.EmpCompo = true;
      this.EmpList = this.responseobj.EmpList;
      this.EmpFlds = { text: "FlagName", value: "FlagValue" };
    }
    if (this.responseobj.ExtraExpensesTypeDetail == 3) {
      this.VendorCompo = true;
      this.EmpCompo = false;
      this.VendorList = this.responseobj.VendorList;
      this.VendorFlds = { text: "FlagName", value: "FlagValue" };
    }
  }

  openModal(event: boolean) {
    if (event) {
      this.showModel = true;
      $("#extraExpensesModal").modal("show");
      setTimeout(() => {
        $("#extraExpensesModal").modal("show");
      }, 1000);
    }
  }

  closeReport() {
    $("#extraExpensesModal").modal("hide");
    // this.ExtraExpensesSer.openExtraExpenses.next(false);
  }

  ExtraExpenses: any;
  pageSettings: any;
  filterOptions: any;
  toolbarOptions: any;

  getExtraExpensesResponse(event: any) {
    this.ExtraExpenses = event.ExtraExpenses;
    this.pageSettings = event.pageSettings;
    this.filterOptions = event.filterOptions;
    this.toolbarOptions = event.toolbarOptions;
    console.log("this.ExtraExpenses", this.ExtraExpenses);
    console.log("this.pageSettings", this.pageSettings);
    console.log("this.filterOptions", this.filterOptions);
    console.log("this.toolbarOptions", this.toolbarOptions);
  }

  toolbarClickExtraExpenses(args: ClickEventArgs): void {
    if (args.item.id === "ExtraExpenses_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.ExtraExpensesGrid.pdfExport();
    }
    if (args.item.id === "ExtraExpenses_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.ExtraExpensesGrid.excelExport();
    }
  }
  setExtraExpensesTypeDetailName(type: number){
    if(type ===1 )
      this.responseobj.ExtraExpensesTypeDetailName = this.VendorList.find(x=> x.FlagValue === this.responseobj.ExtraExpensesTypeDetailDocumentId)?.FlagName;
    else if(type === 2)
      this.responseobj.ExtraExpensesTypeDetailName = this.EmpList.find(x=> x.FlagValue === this.responseobj.ExtraExpensesTypeDetailDocumentId)?.FlagName;

  }
  foucsNextInput(event,id:string){
    let focusedElement = this.getInputElement(id);
    // Find all input elements within the form
    const inputs = Array.from(document.querySelectorAll('#myForm input, #myForm textarea')) as any;

    // Get the index of the currently focused input
    const index = inputs.indexOf(focusedElement);

    // Focus the next input, if it exists
    if (index !== -1 && index < inputs.length - 1) {
      inputs[index + 1].focus();
    }
    event.preventDefault();

  }
  getInputElement(elemId) {
    let element = document.getElementById(elemId);
    
    // Check if the element is an input
    if (element && element.tagName.toLowerCase() === 'input') {
        return element;
    }

    // If not, find the first child input element
    const childInput = element?.querySelector('input');
    return childInput ? childInput : null;
  }

}
