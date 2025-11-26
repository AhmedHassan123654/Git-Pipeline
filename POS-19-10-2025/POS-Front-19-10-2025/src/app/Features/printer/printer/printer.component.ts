import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../print-imports";
@Component({
  selector: "app-printer",
  templateUrl: "./printer.component.html",
  styleUrls: ["./printer.component.css"]
})
export class PrinterComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  public PrintFlds = { text: "name", value: "name" };
  flds = { text: "name", value: "id" };
  orderTypeFlds = { text: "Name", value: "DocumentId" };
  orderNumbersInKitchenList = [];
  //#endregion

  //#region Constructor
  constructor(
    public PrinterSer: imp.PrinterService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public router: imp.Router,
    public toastr: imp.ToastrService
  ) {
    super();
    this.initializeobjects();
  }
  //#endregion
  //#region Angular Life Cycle
  ngOnInit(): void {
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Print = false;
      this.settings = this.responseobj.Setting;
      this.IsMainServer = this.responseobj.IsMainServer;
      this.OrderTypeList = this.responseobj.OrderTypeList;

      this.enableChiled = false;

      this.orderNumbersInKitchenList = [{name:this.translate.instant('customer.All') , id:0}
        ,{name:this.translate.instant('Printer.Odd') , id:1}
        ,{name:this.translate.instant('Printer.Even') , id:2}
      ]
    });
  }
  //#endregion
  //#region Print Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.PrinterSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#endregion

  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    if(this.responseobj && !this.responseobj.OrderNumbersInKitchen) 
      this.responseobj.OrderNumbersInKitchen = 0;
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({}).subscribe(() => {
          //Empty
        });
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
  //#endregion

  //#region Pagger
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  //#endregion
}
