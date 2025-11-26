import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { MinimumChargeService } from "src/app/core/Services/Transactions/minimum-charge.service";
import { general, LanguageSerService, quickAction } from "../../adminstration/permission-imports";
import { Router } from "@angular/router";
import { SettingModel } from "src/app/core/Models/Transactions/setting-model";
declare let $: any;

@Component({
  selector: "app-minimum-charge",
  templateUrl: "./minimum-charge.component.html",
  styleUrls: ["./minimum-charge.component.scss"]
})
export class MinimumChargeComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  public Flds = { text: "Name", value: "Id" };
  public FldDocumentId = { text: "Name", value: "DocumentId" };
  public newTableList: any = [];
  // taxobj = {};
  ifUseTaxatt: boolean = false;
  //#endregion
  constructor(
    public MinimumChargSer: MinimumChargeService,
    private languageSerService: LanguageSerService,
    private Router: ActivatedRoute,
    public translate: TranslateService,
    private router: Router
  ) {
    super();

    this.initializeobjects();
  }

  ngOnInit() {
    this.minimumChargeFirstOpen();
  }
  minimumChargeFirstOpen() {
    this.requestStarted = true;
    this.MinimumChargSer.minimumChargeFirstOpen().subscribe({
      next : (res: any) =>{
        this.AllTables = res.AllTables;
        this.WorkDays = res.WorkDays;
        this.OrderTypeList = res.OrderTypeList;
        this.TaxList = res.TaxList;
        // this.settings = res.settings;
        this.firstOpen();
      },
      error: (err) => {
        this.toastr.error(err);
        this.requestStarted = false;
      }
    });
  }
  firstOpen() {
    this.scrFirstOpen().subscribe(() => {
      let fromtime = this.responseobj.TimeFrom;
      let totime = this.responseobj.TimeTo;
      if (fromtime != null && fromtime != undefined) this.responseobj.TimeFrom = this.setTime(new Date(fromtime));
      if (totime != null && totime != undefined) this.responseobj.TimeTo = this.setTime(new Date(totime));

      if (this.request.currentAction == "Add") {
        this.responseobj.TimeFrom = null;
        this.responseobj.TimeTo = null;
      }
      if (this.request.currentAction == "Edit") {
        this.disabledflag = true;
      }
      this.setRelations();
      this.setMinimumChargeWorkDays();
      this.disableAdd();
      this.requestStarted = false;
    });
  }
  ///save to the database the only checked Tables
  setMinimumChargeTables() {
    this.responseobj.Tables = this.AllTables.filter((t) => t.IsChecked == true);
    // let clearDataAfterRemoveCheck = this.AllTables.forEach(x=>{
    //   x.IsChecked == false;
    // })
    // if()
  }
  ///save to the database the only checked WorkDays
  setMinimumChargeWorkDays() {
    this.responseobj.WorkDays = this.WorkDays.filter((t) => t.IsWork == true);
  }
  //get the tables and the value and the workDays that checked and display it
  setRelations(afterUpdate: boolean = false) {
    if (this.responseobj?.Tables?.length) {
      this.responseobj.Tables.forEach((x) => {
        let table = this.AllTables.find((t) => t.DocumentId == x.DocumentId);
        // if (table?.OrderTypesList?.length > 0) {
        if (table?.OrderTypesList?.length > 0) {
          table.IsChecked = x.ValuePerPerson > 0 ? true : false;
          table.ValuePerPerson = x.ValuePerPerson;
          table.OrderTypesList = x.OrderTypesList;
        } else if(table && !afterUpdate){
          table.IsChecked = x.ValuePerPerson > 0 ? true : false;
          table.ValuePerPerson = x.ValuePerPerson;
          table.OrderTypesList = x.OrderTypesList;
        }else if(table && afterUpdate && !x.IsChecked){
          x.ValuePerPerson = 0;
          x.OrderTypesList = [];
        }
        else if(!table?.ValuePerPerson){
          x .IsChecked = false;
          x .ValuePerPerson = 0;
          x .OrderTypesList = [];
        }
      });
    }
    if (this.responseobj.WorkDays?.length) {
      this.WorkDays.forEach((w) => {
        w.IsWork = false;
      });
      this.responseobj.WorkDays.forEach((x) => {
        let WorkDay = this.WorkDays.find((t) => t.Name == x.Name);
        if (WorkDay) {
          WorkDay.IsWork = true;
        }
      });
    }
    if (this.responseobj?.Tax?.length > 0) {
      this.taxobj = this.responseobj.Tax[0];
    }
  }
  disableAdd() {
    this.responseobj.screenPermission.New = false;
    this.responseobj.screenPermission.Print = false;
    this.responseobj.screenPermission.Delete = false;
  }
  //#region OperationMenu/
  quickEvents(event: quickAction): void {
    this.responseobj.screenPermission.Print = false;
    switch (event) {
      case quickAction.afterNew:
        this.responseobj.Tables.forEach((item) => {
          item.IsChecked = false;
        });
        // this.newTableList = this.responseobj.Tables;
        break;
      case quickAction.beforeAdd:
        break;
      case quickAction.afterAdd:
        this.disabledflag = false;
        break;
      case quickAction.afterUpdate:
        this.disabledflag = false;
        this.disableAdd();
        // this.setRelations(true);
        break;
      case quickAction.beforeUpdate:
        ///send the tax obj into the this.responseobj.Tax array into the database
        this.responseobj.Tax = [this.taxobj];
        this.responseobj.Tables = this.AllTables;
        this.setRelations(true);

        break;
      case quickAction.afterModify:
        this.disabledflag = true;
        this.disableAdd();
        break;
      case quickAction.afterUndo:
        this.disabledflag = false;
        break;
      case quickAction.afterDelete:
        // this.responseobj.Tables.forEach((item) => {
        //   item.IsChecked = false;
        //   item.OrderTypesList = [];
        //   item.ValuePerPerson = 0;
        // });
        this.disabledflag = false;
        break;
    }
  }

  //#endregion
  //#region Pagger

  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.MinimumChargSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#region Pagger
  // afterPag(event: any): void {
  //   this.setRelations()
  //   this.formPaging({ formObj: event });

  //   this.responseobj.TimeFrom = this.setTime(new Date(event.TimeFrom));
  //   this.responseobj.TimeTo = this.setTime(new Date(event.TimeTo));
  // }
  //#endregion

  setTime(date: Date) {
    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);
    let str = hours + ":" + minutes;
    return str;
  }
  CheckWorkDays() {
    $("#modal-WorkDays").modal("show");
  }
  SelectAllEvent(event: any) {
    let value = event.currentTarget.checked;
    this.AllTables.forEach((item) => {
      item.IsChecked = value;
    });
  }
}
