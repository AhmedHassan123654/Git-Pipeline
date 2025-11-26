import { Component } from "@angular/core";
import * as imp from "../integration-setting-import";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";

@Component({
  selector: "app-integration-setting-payments",
  templateUrl: "./integration-setting-payments.component.html",
  styleUrls: ["./integration-setting-payments.component.scss"]
})
export class IntegrationSettingPaymentsComponent extends imp.general implements imp.OnInit {
  [key: string]: any;

  data: any = {};
  flds = { text: "Name", value: "OrderPayTypeDocumentId" };

  yemekOrderPayTypes: any[] = [];
  orderPayTypes: any[] = [];

  IntegrationSystemsName = "";

  constructor(
    public IntegrationSettingSer: imp.IntegrationSettingService,
    private router: imp.Router,
    private route: imp.ActivatedRoute,
    public toastr: imp.ToastrService,
    public toastrMessage: imp.HandlingBackMessages,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    super();
    this.initializeobjects();
  }

  initializeobjects(): void {
    this.responseobj = new imp.IntegrationSettingModel();
    this.service = this.IntegrationSettingSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  ngOnInit(): void {
    if (this.request.DocumentId != undefined && this.request.DocumentId != "") {
      this.IntegrationSettingSer.GetIntegrationSettingPayments(this.request.DocumentId).subscribe((res: any) => {
        this.IntegrationSystemsName = res["IntegrationSystemsName"];
        let allorderPayTypes = res["OrderPayTypes"];
        this.orderPayTypes = this.distinct(allorderPayTypes, "Name");
        this.yemekOrderPayTypes = res["YemekOrderPayTypes"];
      });
    } else {
      this.router.navigate(["/IntegrationSetting/Integrationlist"]);
      this.toastr.error("Should Choose aPricing Class First", "Pricing Class");
    }
  }

  Save() {
    const model = {
      DocumentId: this.request.DocumentId,
      IntegrationSettingPayments: this.yemekOrderPayTypes
    };
    this.IntegrationSettingSer.updateIntegrationPaymnts(model).subscribe((res) => {
      if (res == 1) {
        this.toastr.success(this.toastrMessage.GlobalMessages(res));
        this.router.navigate(["/IntegrationSetting/Integrationlist"]);
      } else {
        this.toastr.error(this.toastrMessage.GlobalMessages(res));
      }
    });
  }
}
