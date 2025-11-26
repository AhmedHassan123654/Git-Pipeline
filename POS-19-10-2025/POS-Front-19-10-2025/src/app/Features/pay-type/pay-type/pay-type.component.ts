import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
// import { CarryCommissionOn } from "src/app/core/Models/Transactions/order-pay-type-model";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../pay-type-import";

@Component({
  selector: "app-pay-type",
  templateUrl: "./pay-type.component.html",
  styleUrls: ["./pay-type.component.scss"]
})
export class PayTypeComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  public Flds = { text: "Name", value: "Id" };
  //#endregion

  //#region Constructor
  constructor(
    public PayTypeSer: imp.PayTypeService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private router: imp.Router,
    public toastr: imp.ToastrService
  ) {
    super();
    this.initializeobjects();
  }
  //#endregion

  //#region Angular Life Cycle
  ngOnInit(): void {
    this.scrFirstOpen().subscribe(() => {
      // this.carryCommissionTypes = [{Id:CarryCommissionOn.Company ,Name: this.translate.instant("Shared.Company") },
      // {Id:CarryCommissionOn.Customer ,Name: this.translate.instant("manageorder.Customer") }]
      this.responseobj.screenPermission.Print = false;
      this.allPayTypes =this.responseobj.PayTypes;
    });
  }
  //#endregion

  //#region PayType Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.PayTypeSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#endregion

  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    switch (event) {
      case imp.quickAction.afterNew:
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
      case imp.quickAction.afterUndo:
        this.enableChiled = false;
        break;
    }
  }
  //#endregion

  //#region Pagger
  afterPag(event: any): void {
    if(event.PayType == 50){
      let pT = this.allPayTypes.find(x=>x.DocumentId == event.DocumentId);
      if(pT.PayType != 50){
        event.PayType = pT.PayType;
      }
    }
    this.formPaging({ formObj: event });
  }
  //#endregion
}
