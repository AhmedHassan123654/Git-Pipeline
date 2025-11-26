import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { CancellationReasonService } from "src/app/core/Services/Transactions/CancellationReason.service";
import { general, LanguageSerService, quickAction, Router, ToastrService } from "src/app/shared/Imports/featureimports";

@Component({
  selector: "app-cancellation-reason",
  templateUrl: "./cancellation-reason.component.html",
  styleUrls: ["./cancellation-reason.component.scss"]
})
export class CancellationReasonComponent extends general implements OnInit {
  [key: string]: any;
  @ViewChild("frmRef") frmRef;

  constructor(
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    private router: Router,
    public CancellationReasonSer: CancellationReasonService,
    public toastr: ToastrService
  ) {
    super();
    this.initializeobjects();
  }

  ngOnInit(): void {
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Print = false;
    });
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.CancellationReasonSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;

    this.FLGDocument = { text: "Name", value: "DocumentId" };
    this.FLG = { text: "Name", value: "Id" };

    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  quickEvents(event: quickAction): void {
    switch (event) {
      case quickAction.afterNew:
        this.afterNew({});
        if (this.responseobj && this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        break;
      case quickAction.afterAdd:
        this.afterAdd();
        if (this.responseobj && this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        break;
      case quickAction.afterModify:
        this.afterModify();
        if (this.responseobj && this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
        break;
    }
  }
}
