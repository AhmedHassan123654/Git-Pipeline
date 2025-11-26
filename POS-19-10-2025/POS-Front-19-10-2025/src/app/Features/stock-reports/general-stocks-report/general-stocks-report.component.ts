import { DatePipe, formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
/* eslint-disable @typescript-eslint/no-empty-function */
import { TranslateService } from "@ngx-translate/core";
import { PrintDetailModel } from "src/app/core/Models/Shared/print-detail-model";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { GeneralStockReportService } from "src/app/core/Services/Reporting/general-stock-report.service";
import * as imp from "../../../shared/Imports/featureimports";
import { SettingService } from "../../../shared/Imports/featureimports";
import { PrintCashirComponent } from "src/app/Features/common/print-cashir/print-cashir.component";
import { res } from "./../../../core/Models/Shared/res";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
interface ITab {
  title: string;
  content: any;
  removable: boolean;
  disabled: boolean;
  active?: boolean;
  customClass?: string;
}
declare var Stimulsoft: any;
declare let $: any;

@Component({
  selector: "app-general-stocks-report",
  templateUrl: "./general-stocks-report.component.html",
  styleUrls: ["./general-stocks-report.component.scss"]
})
export class GeneralStocksReportComponent implements OnInit {
  [key: string]: any;
  tabs: ITab[] = [];
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  translateSection = "stock";
  printDetailobj: PrintDetailModel = new PrintDetailModel();
  public languages: any[] = [
    { Id: 1, Name: "English" },
    { Id: 2, Name: "Arabic" },
    { Id: 3, Name: "Turkish" },
    { Id: 4, Name: "French" }
  ];
  report: any = new Stimulsoft.Report.StiReport();
  constructor(
    private toastr: imp.ToastrService,
    private toastrMessage: imp.HandlingBackMessages,
    public datepipe: DatePipe,
    private router: imp.Router,
    private route: imp.ActivatedRoute,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    public generalStockReportService: GeneralStockReportService,
    private settingService: SettingService
  ) {
    this.initializeobjects();
    this.getSettings();
  }

  ngOnInit(): void {
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
      "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
      "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
      "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
      "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
      "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
      "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";
    this.firstOpen();
  }

  initializeobjects() {
    this.responseobj = {};
    this.languageSerService.currentLang.subscribe((lan) => this.translate.use(lan));
    this.fields = { text: "Name", value: "Id" };
  }
  firstOpen() {
    this.generalStockReportService.firstOpen().subscribe((res) => {
      this.responseobj = res as res;
      this.initiateData();
    });
    this.stockTypelst = [
      { DocumentId: 1, Name: "Stocks" },
      { DocumentId: 2, Name: "Kitchens" }
    ];
  }
  initiateData() {
    this.printDetailobj.DestinationId = 1;
    this.itemsGroups = this.responseobj.Lists?.ItemGroups;
    this.stockList = this.responseobj.Lists?.Stocks;
    this.kitchenList = this.responseobj.Lists?.Kitchens;
    this.listFlds = { text: "Name", value: "DocumentId" };
    this.itemListFlds = { text: "Name", value: "Id" };

    this.items = [];
    this.itemsGroups != null
      ? this.itemsGroups.forEach((x) => {
          // tslint:disable: curly
          if (x && x.Items && x.Items.length !== 0)
            x.Items.forEach((element) => {
              this.items.push(element);
            });
        })
      : // tslint:disable: no-unused-expression
        [];
    this.items = this.items.filter((x) => !x.IsGeneral);
    this.filteredItems = Object.assign([], this.items);
  }
  filterItems() {
    if (this.responseobj.ItemGroupIds == null) this.filteredItems = Object.assign([], this.items);
    else
      this.filteredItems = Object.assign(
        [],
        this.items.filter((x) => this.responseobj.ItemGroupIds.includes(x.GroupId))
      );
  }
  setReportType(type: number) {
    this.responseobj.ReportType = type;
  }
  print(cashirReport?: boolean) {
    this.setLanguageSettings();
    this.responseobj.CashirReport = cashirReport;
    this.generalStockReportService.printReport(this.responseobj).subscribe((data: Response) => {
      this.Reportdata = data;
      this.showReport(data);
    });
    // switch (this.responseobj.ReportType) {
    //   case 1:
    //     this.generalStockReportService.printReport(this.responseobj).subscribe((data: Response) => {

    //       this.Reportdata = data;
    //       this.showReport(data);

    //     });

    //     break;
    //   case 2:

    //     break;
    //   case 3:

    //     break;

    //   default:

    //     break;
    // }
    this.responseobj.Labels = this.myjson;
  }

  //   printPriview(printCashirPerview) {
  //     // const order=this.getReportTranslationObj(data);
  //  this.generalStockReportService.printReport(this.responseobj).subscribe(
  //    (data: Response)=>{
  //          // Step 4: Another code
  //          // debugger
  //        this.reportData= data;
  //        printCashirPerview(data);
  //        });
  //    }
  showReport(data) {
    let options2: any = new Stimulsoft.Viewer.StiViewerOptions();
    let viewer2: any = new Stimulsoft.Viewer.StiViewer(options2, "StiViewer", false);
    let report2 = new Stimulsoft.Report.StiReport();
    report2.loadDocument(data);
    viewer2.report = report2;
    viewer2.renderHtml("viewer");
  }
  setLanguageSettings() {

    this.myjson = {};
    switch (this.printDetailobj.LanguageId) {
      case 1:
        this.myjson = en["stock"];
        this.responseobj.CurrentLang = "en";
        break;
      case 2:
        this.myjson = ar["stock"];
        this.responseobj.CurrentLang = "ar";
        break;
      case 3:
        this.myjson = tr["stock"];
        this.responseobj.CurrentLang = "tr";
        break;
      case 4:
        this.myjson = fr["stock"];
        this.responseobj.CurrentLang = "fr";
        break;

      default:
        this.myjson = en["stock"];
        this.responseobj.CurrentLang = "en";
        break;
    }
    this.responseobj.Labels = this.myjson;
  }
  setReport(data) {
    this.printDetailobj.LanguageId = data.value;
    this.print();
  }
  getSettings() {
    this.settingService.GetSettings().subscribe((res) => {
      this.settings = res as any;
      this.printDetailobj.LanguageId = this.settings.SystemMainLanguage;
      this.listFlds = { text: "Name", value: "DocumentId" };
      this.responseobj.StockType = 1;
      //   if( this.settings && this.settings.UseStocksAndPurchase == true &&
      //     this.settings.DealingWithStockAs == 2)
      //   {
      //     this.responseobj.StockType=2;
      //     this.stockTypelst = [];
      //     this.stockTypelst = [
      //     {"DocumentId":2,
      //     "Name":"Kitchens"}
      //   ];
      //  }
      //  else
      if (this.settings && this.settings.UseStocksAndPurchase == true && this.settings.DealingWithStockAs == 1) {
        this.stockTypelst = [];
        this.stockTypelst = [{ DocumentId: 1, Name: "Stocks" }];
      }
    });
  }
}
