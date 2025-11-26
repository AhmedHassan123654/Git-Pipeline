import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../driverimport";

@Component({
  selector: "app-drivers",
  templateUrl: "./drivers.component.html",
  styleUrls: ["./drivers.component.css"]
})
export class DriversComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  //#endregion

  constructor(
    public driverSer: imp.DriverService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private router: imp.Router
  ) {
    super();
    this.initializeobjects();
  }

  ngOnInit() {
    // this.driverFirstOpen();
    this.scrFirstOpen().subscribe(() => {
      if (!this.responseobj || !this.responseobj.DocumentId) {
        this.responseobj.IncludedInTotal = true;
      }
      this.responseobj.CanEditSynced = true ;
    });
  }

  //#region driver Methods
  initializeobjects(): void {
    this.enableChiled = false;

    this.responseobj = {};
    this.service = this.driverSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
    this.responseobj.CanEditSynced = true ;
  }
  //#endregion

  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    this.responseobj.CanEditSynced = true ;
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({});
        if (!this.responseobj.DocumentId) {
          this.responseobj.IncludedInTotal = true;
        }
        this.enableChiled = true;
        break;

      case imp.quickAction.afterAdd:
        this.afterAdd();
        this.enableChiled = false;
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
        this.enableChiled = true;
        break;
      case imp.quickAction.afterUpdate:
        this.enableChiled = false;
        break;
      case imp.quickAction.afterUndo:
        this.enableChiled = false;
        break;
    }
  }
  setDriverPriceSettings(type: number, IsTrue: boolean) {
    this.responseobj.IncludedInTotal = false;
    this.responseobj.NotIncludedInTotal = false;
    this.responseobj.FixedDeliveryPersonAmount = false;
    if (type == 1 && IsTrue) this.responseobj.IncludedInTotal = true;
    else if (type == 2 && IsTrue) this.responseobj.NotIncludedInTotal = true;
    else if (type == 3 && IsTrue) this.responseobj.FixedDeliveryPersonAmount = true;
  }
  //#endregion
  /* checkEmployee(){
    if(this.driverobj.EmployeeId){
      if(this.comboboxEmployeelist.findIndex(x=>x.FlagValue==this.driverobj.EmployeeId)==-1)
      this.driverobj.EmployeeId=null;
    }
  } */

  /*   checkPhone(){
    this.driverSer.GetDriverByPhone(this.driverobj.TelephoneNumber).subscribe((res)=>{
      if((res as boolean)==true){
        this.toastr.error("this Phone already exist",'Driver');
        this.driverobj.TelephoneNumber=null;
      }
    })
  } */

  // Start : First open
  /*  clearobject() {
    this.driverobj = new imp.DriverModel();
    this.driverobj.MaxOrders =0;
  } */
}
