import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { DashboardService } from "src/app/core/Services/Transactions/dashboard.service";
import { EndShiftService } from "src/app/core/Services/Transactions/endShift.service";
import {
  ClickEventArgs,
  GridComponent,
  HandlingBackMessages,
  SettingService,
  ToastrService
} from "../../user/userimport";
import {Router } from "src/app/shared/Imports/featureimports";

declare let $: any;
declare var Stimulsoft: any;
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import { SettingModel } from "src/app/core/Models/Transactions/setting-model";
import { DatePipe } from "@angular/common";
@Component({
  selector: "app-end-shift",
  templateUrl: "./end-shift.component.html",
  styleUrls: ["./end-shift.component.scss"]
})
export class EndShiftComponent implements OnInit {
  [key: string]: any;
  incominguserobj: any = {};
  MyIncomingUserObj: any = {};
  setting: any = new SettingModel();
  public fields: Object = { text: "UserName", value: "AppUserId" };
  @ViewChild("grid") grid: GridComponent;
  public dateFormat: any = { type: "date", format: "dd/MM/yyyy" };
  oading: boolean = true;
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  incomingDate: any={}
  priceFormat = { format: 'n2' };
  dayDate:any;
  updatedArr: any [] =[]

  constructor(
    private serv: EndShiftService,
    private dashboardSer: DashboardService,
    private toastr: ToastrService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private toastrMessage: HandlingBackMessages,
    public settingService: SettingService,
    private router: Router
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.incomingDate = this.router.getCurrentNavigation().extras as unknown
  //  console.log('this.incomingDate',this.incomingDate);
    
  }

  ngOnInit(): void {
   // this.fDate = this.toDate = new Date();
   //console.log(this.dayDate);

   this.initializeGrid();
    this.firstOpen();
    this.printDetailobj = {};
    this.incominguserobj;
    this.settingService.GetSettings().subscribe((data: SettingModel) => {
      this.setting = data;
      this.priceFormat = { format: 'n' + this.setting?.Round };
      if (this.setting && this.setting.SystemMainLanguage > 0)
        this.printDetailobj.LanguageId = this.setting.SystemMainLanguage;
      else this.printDetailobj.LanguageId = 2;
    });
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
      "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
      "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
      "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
      "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
      "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
      "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";
  }
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === "Grid_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.grid.pdfExport();
    }
    if (args.item.id === "Grid_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.grid.excelExport();
    }
  }
  initializeGrid() {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = ["Search", "PdfExport", "ExcelExport"];
    this.editOptions = {
      showDeleteConfirmDialog: true,
      allowEditing: true,
      allowDeleting: true
    };
    this.filterOptions = {
      type: "Menu"
    };
    this.fromDate = this.toDate = new Date();
  }

  dateToString(date){
    if(!date) return "";
    const dateTime = new Date(date);
    const year = dateTime.getFullYear();
    const month = String(dateTime.getMonth() + 1).padStart(2, '0');
    const day = String(dateTime.getDate()).padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate
  }

  firstOpen() {
    let model = { date: this.dayDate, UserId: this.UserId ,FDate:null , ToDate:null};

    this.dayDate =  this.dateToString(this.incomingDate.DayDate);
    if(this.incomingDate?.DayDate)
      model.FDate = model.ToDate = this.dayDate;
    else if(this.fromDate && this.toDate){
      model.FDate = this.dateToString(this.fromDate);
      model.ToDate = this.dateToString(this.toDate);
    }
    this.serv.firstOpen(model).subscribe((res: any) => {
      this.users = res["users"] as any[];
      this.permission = res.permissions;
      if(this.incomingDate?.DayDate)
      {
        this.updatedArr = res.incomingUsers.filter((el)=> {
          return (this.dateToString(el.CreationTime) === this.dayDate)
        })
      }
      else{
        this.updatedArr = res.incomingUsers;
        if(this.fromDate && this.toDate){
          this.updatedArr = res.incomingUsers.filter((el)=> {
            return (this.dateToString(el.CreationTime) >= this.dateToString(this.fromDate)  && 
            this.dateToString(el.CreationTime) <= this.dateToString(this.toDate))
          })
        }
      }
      
      
      this.updatedArr.forEach((x) => {
        let user = this.users.filter((u) => u.AppUserId == x.UserId)[0];
        if (user) x.UserName = user.UserName;
      });
       console.log('updatedArr',this.updatedArr );
       
    });
  }
  get disableEdit(){
    return !this.permission?.Edit;
  }

  // FilterDataByEmployee(){
  //   debugger
  //   let model = {  UserId: this.UserId };
  //   this.serv.firstOpen(model).subscribe((res: any) => {
  //     debugger
  //     this.users = res["users"] as any[];
  //     debugger
  //     this.updatedArr.forEach((x) => {
  //       let user = this.users.filter((u) => u.AppUserId == x.UserId)[0];
  //       if (user) x.UserName = user.UserName;
  //       debugger
  //     });
  //   })
  //    console.log('FilterDataByEmployee',this.updatedArr);
     
  // }
  SetDayOpend(data: any) {
    if(data.IsSync == true) return;
    this.serv.SetDayOpend(data.DocumentId).subscribe((res) => {
      if (res == 1) {
        this.toastr.success("Done");
        this.firstOpen();
      }
    });
  }
  PrintCashierEndShift(DocumentId: string) {
    this.model = [];
    if (this.printDetailobj.LanguageId == 1) {
      this.model.push(DocumentId);
      this.myjson = en["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 2) {
      this.model.push(DocumentId);
      this.myjson = ar["Reports"];
      this.model.push(this.myjson);
      this.model.push("ar");
    }
    if (this.printDetailobj.LanguageId == 3) {
      this.model.push(DocumentId);
      this.myjson = tr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.model.push(DocumentId);
      this.myjson = fr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }

    if (this.printDetailobj.DestinationId == 2) {
      this.model.push(this.printDetailobj.Reciever);
      this.model.push(this.printDetailobj.Title);
      this.model.push(this.printDetailobj.Message);
      this.ifPerview = false;
    } else {
      this.ifPerview = true;
    }
    this.serv.PrintCashierEndShift(this.model).subscribe((data) => {
      this.loading = false;
      this.report?.loadDocument(data);
      this.viewer.report = this.report;
      this.viewer.renderHtml("myviewer");
      document.getElementById("myviewer").dir = "ltr";
      $("#modal-5").modal("show");
    });
  }
  GetshiftData(data: any) {
    this.incominguserobj = data;
    console.log(this.incominguserobj);
    
  }
  UpdateEndShift() {
    this.dashboardSer.UpdateShift(this.incominguserobj).subscribe(
      (res: any) => {
        if (res == 1) {
          this.toastr.success(this.toastrMessage.GlobalMessages(1));
          $("#endshiftmodal").modal("hide");
          this.firstOpen();
        }
      },
      (err) => {
      }
    );
  }

  GetPayList(DocumentId) {
    this.serv.GetCurrentIncomingUser(DocumentId).subscribe((res: any) => {
      this.MyIncomingUserObj = res;
      let pipe = new DatePipe("en-US");
      this.MyIncomingUserObj.Date = pipe.transform(this.MyIncomingUserObj.CreationTime, "dd/MM/yyyy");
    });
  }
  UpdateIncomingUser() {
    this.serv.UpdateIncomingUser(this.MyIncomingUserObj).subscribe(
      (res: any) => {
        if (res == 2) {
          this.toastr.info(this.toastrMessage.GlobalMessages(res));
          $("#endshiftmodal2").modal("hide");
          this.firstOpen();
        }
      },
      (err) => {
      }
    );
  }
}
