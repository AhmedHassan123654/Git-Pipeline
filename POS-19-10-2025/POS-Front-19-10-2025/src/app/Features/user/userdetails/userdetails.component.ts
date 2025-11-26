import * as imp from "../userimport";
import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";

declare var $: any;

@Component({
  selector: "app-userdetails",
  templateUrl: "./userdetails.component.html",
  styleUrls: ["./userdetails.component.css"]
})
export class UserdetailsComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  //#endregion

  //#region Constructor
  constructor(
    public userDetailsSer: imp.UserDetailsService,
    private router: imp.Router,
    public toastr: imp.ToastrService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public toastrMessage: imp.HandlingBackMessages,
    private route: imp.ActivatedRoute
  ) {
    super();
    this.initializeobjects();
  }
  //#endregion

  //#region User Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.userDetailsSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  //#endregion
  //#region Angular Life Cycle

  ngOnInit() {
    this.GetCustomers();
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Print = false;
    });
  }
  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({}).subscribe(() => {
          this.responseobj.UserNumber = this.responsedata.UserNumber;
        });
        break;
      case imp.quickAction.afterModify:
        this.responseobj.ConfirmPassword = this.responseobj.Password;
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd();
        break;
    }
  }
  //#endregion
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  GetCustomers() {
    this.userDetailsSer.GetAllEmps().subscribe((res) => {
      this.EmpsList = res as any;
      this.EmpFlds = { text: "Name", value: "DocumentId" };
    });
  }
}
