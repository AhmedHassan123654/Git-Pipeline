import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { GridComponent } from "@syncfusion/ej2-angular-grids";
import { ToastrService } from "ngx-toastr";
import { general, BranchService, LanguageSerService, HandlingBackMessages, quickAction, SettingService } from "../branchimport";
import { BehaviorSubject } from "rxjs";
import { TaxAuthorityService } from "src/app/core/Services/ManageOrders/TaxAuthorityService";
import { PointOfSaleModel } from "src/app/core/Models/Transactions/point-of-sale-model";
import Swal from "sweetalert2";

@Component({
  selector: "app-branch",
  templateUrl: "./branch.component.html",
  styleUrls: ["./branch.component.css"]
})
export class BranchComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  @ViewChild("grid", { static: false }) grid: GridComponent;
  //#endregion
  customClass = "customClass";
  branchFlds = { text: "Name", value: "DocumentId" };
  branchOrderTypesPrices: any = [];
  filterdOrderTypes: any = [];
  pos: PointOfSaleModel;
  gridFlage: BehaviorSubject<boolean> = new BehaviorSubject(true);

  isFirstOpen = true;
  constructor(
    public branchSer: BranchService,
    public taxAuthorityService: TaxAuthorityService,
    public SettingSer: SettingService,
    private router: Router,
    private toastr: ToastrService,
    private languageSerService: LanguageSerService,
    private toastrMessage: HandlingBackMessages,
    private translate: TranslateService
  ) {
    super();
    this.initializeobjects();
  }

  ngOnInit() {
    this.GetSettings();
    this.getAllstocks();
    this.branchSer.branchFirstOpenAsync().subscribe((res: any) => {
      this.orderTypes = res.orderTypes;
      this.pricingClasses = res.pricingClasses;
      this.pos = res.pos as PointOfSaleModel;
    });

    document.getElementById("uplade_Img").classList.add("d-none");
    document.getElementById("upladDone").classList.remove("d-none");
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Print = false;
      this.responseobj.screenPermission.Edit = true;
      this.responseobj.screenPermission.Save = true;
      this.intBranchOrderType(this.responseobj.BranchOrderTypes);
    });
  }
  GetSettings() {
    this.SettingSer.GetSettings().subscribe((res) => {
      this.settingobj = res as any;
    });
  }
  intBranchOrderType(branchOrderTypes: any) {
    this.responseobj.branchOrderTypesPrices = branchOrderTypes;
    if (this.responseobj.branchOrderTypesPrices && this.orderTypes) {
      this.filterdOrderTypes = [];
      if (this.responseobj.IsTakeAway == true || this.responseobj.IsDriveThru == true) {
        this.filterdOrderTypes = this.filterdOrderTypes.concat(this.orderTypes.filter((x) => x.Value == 1));
      }
      if (this.responseobj.IsDelivery == true) {
        this.filterdOrderTypes = this.filterdOrderTypes.concat(this.orderTypes.filter((x) => x.Value == 2));
      }
      if (this.responseobj.IsDineIn == true) {
        this.filterdOrderTypes = this.filterdOrderTypes.concat(this.orderTypes.filter((x) => x.Value == 4));
      }
      this.filterdOrderTypes = this.distinct(this.filterdOrderTypes, "DocumentId");
    }
  }
  //#region Branch Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.branchOrderType = {};
    this.responseobj.screenPermission = {};
    this.responseobj.screenPermission.Edit = true;
    this.responseobj.screenPermission.Save = true;
    this.service = this.branchSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#endregion
  //#region OperationMenu
  quickEvents(event: quickAction): void {
    if(this.responseobj) this.responseobj.registerBranchClicked = false;
    switch (event) {
      case quickAction.afterNew:
        this.afterNew({});
        this.responseobj.branchOrderTypesPrices = [];
        break;
      case quickAction.afterModify:
        this.gridFlage.next(false);
        break;
      case quickAction.afterAdd:
        this.afterAdd();
        this.gridFlage.next(true);
        break;
      case quickAction.afterUpdate:
        this.gridFlage.next(true);
        break;
      case quickAction.beforeAdd:
        this.checkBranchOrderTypeValidations();
        break;
      case quickAction.beforeUpdate:
        this.checkBranchOrderTypeValidations();
        break;
    }
  }

  //#endregion
  //#region Pagger
  afterPag(event: any): void {
    this.formPaging({ formObj: event });
    this.intBranchOrderType(event.BranchOrderTypes);
    this.responseobj.branchOrderTypesPrices = event.BranchOrderTypes;
  }
  //#endregion

  uploadImage(event: any) {
    //
    if (event.target.files) {
      var reader = new FileReader();
      this.myfile = event.target.files;
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        //
        this.responseobj.Logo = event.target.result;
      };
    }
  }
  removeImage() {
    this.responseobj.Logo = null;
  }

  getAllstocks() {
    this.branchSer.GetAllstocks().subscribe((res) => {
      this.StockList = res as any;
      this.Flds = { text: "Name", value: "DocumentId" };
    });
  }

  save() {
    this.branchSer.Transactions(this.responseobj, "Edit").subscribe((res: any) => {
      if (res == 2) {
        this.toastr.success(this.toastrMessage.GlobalMessages(res));
      }
    });
  }

  uploadFile() {
    let fileToUpload = <File>this.myfile[0];
    const formData = new FormData();
    formData.append("file", fileToUpload, fileToUpload.name);

    this.branchSer.UploadImages(formData).subscribe((res: any) => {
      //
      if (res == true) {
        this.toastr.success(this.toastrMessage.GlobalMessages(res));
      }
    });
  }

  insertRow() {
    let deebList = this.responseobj.branchOrderTypesPrices ? this.deepCopy(this.responseobj.branchOrderTypesPrices) : [];
    deebList.push({});

    this.responseobj.branchOrderTypesPrices = deebList;
  }
  deleteRow(i: number) {
    this.responseobj.branchOrderTypesPrices.splice(i,1);
  }

  filterOrderTypes(orderTypeValue: number, event: any) {
    if (!event.target.checked) {
      if (
        (orderTypeValue == 1 && this.responseobj.IsDriveThru && !this.responseobj.IsTakeAway) ||
        (orderTypeValue == 1 && !this.responseobj.IsDriveThru && this.responseobj.IsTakeAway)
      ) {
        //do nothing
      } else {
        this.filterdOrderTypes = this.filterdOrderTypes.filter((x) => x.Value != orderTypeValue);
      }

      this.responseobj.branchOrderTypesPrices.forEach((x, index) => {
        if (
          (x.OrderTypeValue && x.OrderTypeValue == orderTypeValue) ||
          (x.OrderTypeDocumentId && Object.keys(x).length === 2)
        ) {
          let findIndex = this.responseobj.branchOrderTypesPrices.findIndex((element) => element === x);
          if (findIndex != -1) {
            if (
              (orderTypeValue == 1 && this.responseobj.IsDriveThru && !this.responseobj.IsTakeAway) ||
              (orderTypeValue == 1 && !this.responseobj.IsDriveThru && this.responseobj.IsTakeAway)
            ) {
              //do nothing
            } else {
              this.responseobj.branchOrderTypesPrices.splice(findIndex, 1);
            }
          }
        }
      });
    } else {
      let newOrderTypes = this.orderTypes.filter((x) => x.Value == orderTypeValue);
      if (!this.filterdOrderTypes) this.filterdOrderTypes = [];
      if (newOrderTypes && this.filterdOrderTypes && !this.filterdOrderTypes.find((d) => d.Value == orderTypeValue)) {
        this.filterdOrderTypes = this.filterdOrderTypes.concat(newOrderTypes);
      }
    }
  }

  updateBranchOrderTypePrices() {
    if (this.responseobj.branchOrderTypesPrices && this.orderTypes.length > 0 && this.pricingClasses.length > 0) {
      this.responseobj.BranchOrderTypes = [];
      this.responseobj.branchOrderTypesPrices.forEach((x: any) => {
        let ordertype = this.orderTypes.find((o) => o.DocumentId == x.OrderTypeDocumentId);
        let pricingClass = this.pricingClasses.find((p) => p.DocumentId == x.PricingClassDocumentId);

        this.branchOrderType = {};
        this.branchOrderType.OrderTypeId = ordertype?.Id;
        this.branchOrderType.OrderTypeDocumentId = ordertype?.DocumentId;
        this.branchOrderType.OrderTypeFerpCode = ordertype?.FerpCode;
        this.branchOrderType.OrderTypeValue = ordertype?.Value;

        this.branchOrderType.PricingClassId = pricingClass?.Id;
        this.branchOrderType.PricingClassDocumentId = pricingClass?.DocumentId;
        this.branchOrderType.PricingClassFerpCode = pricingClass?.FerpCode;

        this.branchOrderType.BranchDocumentId = this.responseobj?.DocumentId;
        this.branchOrderType.BranchId = this.responseobj?.Id;
        this.branchOrderType.BranchFerpCode = this.responseobj?.FerpCode;
        this.responseobj.BranchOrderTypes.push(this.branchOrderType);
      });
      this.responseobj.branchOrderTypesPrices = [];
      this.responseobj.branchOrderTypesPrices = this.responseobj.BranchOrderTypes;
    }
  }

  isGridFlag(event: boolean) {
    if (event) this.gridFlage.next(true);
    else this.gridFlage.next(false);
  }
  checkBranchOrderTypeValidations() {
    this.updateBranchOrderTypePrices();
    if (
      ((this.responseobj.IsDelivery ||
        this.responseobj.IsDineIn ||
        this.responseobj.IsTakeAway ||
        this.responseobj.IsDriveThru) &&
        (!this.responseobj.BranchOrderTypes || this.responseobj.BranchOrderTypes.length === 0)) ||
      (this.responseobj.BranchOrderTypes?.length > 0 &&
        this.responseobj.BranchOrderTypes.find((x) => !x.PricingClassDocumentId || !x.OrderTypeDocumentId))
    ) {
      this.toastr.warning("you must select an OrderType And a PricingClass");
      this.frmRef.form.setErrors({ invalid: true });
    }
  }
  checkDuplicateOT(item: any, branchOrderTypesPrices: any, i: number) {
    let duplicateOT = branchOrderTypesPrices?.filter((x, index) => {
      if (x.OrderTypeDocumentId == item.OrderTypeDocumentId && i != index) {
        return x;
      }
    });
    if (duplicateOT?.length > 0) {
      this.toastr.warning("You Cant Assign Same OrderType in two Rows");
      this.deleteRow(i);
    }
  }
  registerBranch(){
    
    if(!this.isValidDataForRegister()) return;

    Swal.fire({
      title: this.translate.instant("messages.solutionUnitOtp"),
      input: 'text',
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: this.translate.instant('Shared.RegisterBranch'),
      cancelButtonText:this.translate.instant('Shared.Cancel'),
      showLoaderOnConfirm: true,
      preConfirm: (solutionUnitOtp) => {
        this.taxAuthorityService.registerBranch(this.responseobj.DocumentId,solutionUnitOtp)
        .subscribe((res :any)=>{
          if(res == true){
            this.toastr.success("Registered Successfully");
          }
         });
      }
    });
     
  }
  registerBranchRequired(value){
    return this.settingobj?.CountryType === 2 && !value && this.responseobj.registerBranchClicked;
  }
  isValidDataForRegister()
  {
    if(!this.responseobj?.DocumentId || !this.responseobj?.Password || !this.responseobj?.UserName ||
      !this.responseobj?.TaxNumber || !this.responseobj?.CommercialRecord||
      !this.responseobj?.TelephoneNumber|| !this.responseobj?.AddressDetails
      ){

        if(!this.responseobj?.TelephoneNumber)
          this.toastr.warning(this.translate.instant('UserProfile.PhoneNumberRequired'));
        if(!this.responseobj?.AddressDetails)
          this.toastr.warning(this.translate.instant('Shared.AddAddress'));

        this.responseobj.registerBranchClicked= true;
        return false;
    }

    return true;
  }
}
