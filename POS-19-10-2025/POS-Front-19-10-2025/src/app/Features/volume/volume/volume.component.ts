import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../volume-imports";

@Component({
  selector: "app-volume",
  templateUrl: "./volume.component.html",
  styleUrls: ["./volume.component.scss"]
})
export class VolumeComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  //#endregion

  //#region Constructor
  constructor(
    public volumeSer: imp.VolumeService,
    public router: imp.Router,
    public toastr: imp.ToastrService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService
  ) {
    super();
    this.initializeobjects();
  }
  //#endregion
  //#region Angular Life Cycle
  ngOnInit(): void {
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Print = false;
    });
  }

  //#endregion

  //#region CashReceipt Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.volumeSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#endregion

  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    switch (event) {
      case imp.quickAction.afterNew:
        this.responseobj = {};
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd();
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
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
