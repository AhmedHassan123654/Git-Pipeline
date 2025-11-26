import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../feedemployees-imports";

@Component({
  selector: "app-feedemployees",
  templateUrl: "./feedemployees.component.html",
  styleUrls: ["./feedemployees.component.scss"]
})
export class FeedemployeesComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  //#endregion
  //#region Constructor
  constructor(
    public foodplanservice: imp.FoodPlanService,
    public router: imp.Router,
    public toastr: imp.ToastrService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    super();
    this.initializeobjects();
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  //#endregion
  ngOnInit(): void {
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Print = false;
    });
  }
  //#region CashReceipt Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.foodplanservice;
    this.request = this.router.getCurrentNavigation().extras as unknown;
  }
  //#endregion
  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({}).subscribe(() => {
          //  let x = this.responsedata;
          //Empty
        });
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd();
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
        break;
      case imp.quickAction.beforeAdd:
        if (
          this.responseobj != undefined &&
          (this.responseobj.IsStopped == null || this.responseobj.IsStopped == undefined)
        ) {
          this.responseobj.IsStopped = false;
        }
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
