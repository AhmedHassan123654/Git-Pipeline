import { OrderService } from "./../../../core/Services/Transactions/order.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../open-day-imports";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import Swal from "sweetalert2";
import { OrderModel, SettingService } from "../../return-order/return-order-imports";
import { SettingModel } from "src/app/core/Models/Transactions/setting-model";
import { EndOfDayService } from "src/app/core/Services/Transactions/end-of-day.service";
@Component({
  selector: "app-open-day-list",
  templateUrl: "./open-day-list.component.html",
  styleUrls: ["./open-day-list.component.scss"]
})
export class OpenDayListComponent implements OnInit {
  constructor(
    public opendayser: imp.OpenDayService,
    public router: imp.Router,
    public toastr: imp.ToastrService,
    private toastrMessage: imp.HandlingBackMessages,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private orderService: OrderService,
    public settingService: SettingService,
    private EndOfDayService: EndOfDayService,

    ) {
    this.initializeobjects();
  }
  //#region Declartions
  [key: string]: any;
  public format = { type: "date", format: "dd/MM/yyyy" };
  @ViewChild("frmRef") frmRef;
  @ViewChild("Grid", { static: false }) grid: imp.GridComponent;
  getAllUnClosedOrders: [] = [];
  openOrders: boolean;
  orderDate: any;
  dayHaveOpenOrders: boolean= false;
  unclosedOrder: OrderModel;
  selectedDayDate: string;
  opendayDocumentID: any;
  //#endregion
  ngOnInit(): void {
    this.GetData();
    this.initializeGrid();
  }
  //#region OpenDay Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.printDetailobj = {};
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.settingService.GetSettings().subscribe((data: SettingModel) => {
      this.settings = data;
      if (this.settings && this.settings.SystemMainLanguage > 0)
        this.printDetailobj.LanguageId = this.settings.SystemMainLanguage;
      else this.printDetailobj.LanguageId = 2;
    });


  }
  GetData() {
    this.opendayser.getGrideList().subscribe((res) => {
      this.responseobj = res as any;
    });
  }

  initializeGrid(): void {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.filterOptions = {
      type: "Menu"
    };
  }
  ShowReport(data: any) {
    // debugger   
    this.router.navigateByUrl("/endofdayreport", data);
  }

  CloseDay(data: any) {
 
      this.orderService.GetAllUnClosedOrders().subscribe((res) => {
        this.getAllUnClosedOrders = res as [];
        this.selectedDayDate = new Date(data.CreationTime).toLocaleDateString()
        this.opendayDocumentID = data.DocumentId;
        this.unclosedOrder = this.getAllUnClosedOrders.find((item: any) => {
          
          if(item.OpenDayDocumentId == this.opendayDocumentID || 
            this.selectedDayDate == new Date(item.CreationTime).toLocaleDateString()){
            return item;
          }
        });

        if(this.unclosedOrder){
          this.dayHaveOpenOrders = true
        }
        else{
          this.dayHaveOpenOrders = false
        }
        if(this.dayHaveOpenOrders === true){
          this.toastr.error('You Should Close All Orders');
        }else if(this.dayHaveOpenOrders === false){
          Swal.fire({
            title: this.translate.instant("Shared.Areyousure?"),
            text: this.translate.instant("Shared.CloseDay"),
            icon: "error",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: this.translate.instant("Shared.CloseDay"),
            cancelButtonText:this.translate.instant("Shared.Cancel"),
          }).then((result) => { 
            if (result.isConfirmed) {
              const LanguageOptions = this.getCloseDayReportTranslationObj();
              data.LanguageOptions = LanguageOptions;
              this.opendayser.CloseDay(data).subscribe((res) => {
                if (res == 1) {
                  this.toastr.info('Edited successfully');
                }
                this.responseobj.OpenDayDocumentId = data.DocumentId;
                this.responseobj.FromDate = data.DayDate;
                this.responseobj.ToDate = data.DayDate;
                this.responseobj.FromTime = data.FromTime;
                this.responseobj.ToTime = data.ToTime;
                this.responseobj.DayName = data.DayName;
                this.swallPrintFinalReport();
              });
            }
          });
        }
      });
  }
  swallPrintFinalReport(){
    Swal.fire({
      title: this.translate.instant("messages.printFinalReport"),
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this.translate.instant("stock.Print"),
      cancelButtonText:this.translate.instant("Shared.Cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        this.responseobj.ImmediatePrint = true;
        this.printFinalReport();
      }
      this.GetData();
    });
  }
  printFinalReport(){
    this.requestStarted = true;
    this.EndOfDayService.prepareReportLables(this.printDetailobj,this.responseobj , this.myjson);
    this.EndOfDayService.PrintFirst(this.responseobj).subscribe((data: Response) => {
      this.requestStarted = false;
      this.responseobj.ImmediatePrint = false;
    });
  }

  OpenDay(data: any) {
    Swal.fire({
      title: this.translate.instant("Shared.Areyousure?"),
      text: this.translate.instant("Shared.UnCloseDay"),
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this.translate.instant("Shared.UnCloseDay")
    }).then((result) => {
      if (result.isConfirmed) {
        this.opendayser.OpenDay(data.DocumentId).subscribe((res) => {
          if (res == 1) {
            this.toastr.info(this.toastrMessage.GlobalMessages(2));
          }
          this.GetData();
        });
      }
    });
  }
  //#endregion
  goToEndShift(data:any){
    this.router.navigateByUrl('/endShift',data)
  }
  getCloseDayReportTranslationObj(){
    let Direction : string = "ar";
    let finalLang : any;
    if (this.printDetailobj.LanguageId == 1) {
      Direction = "en";
      finalLang = en["Reports"];
    }
    if (this.printDetailobj.LanguageId == 2) {
      Direction = "ar";
      finalLang = ar["Reports"];
    }
    if (this.printDetailobj.LanguageId == 3) {
      Direction = "en";
      finalLang = tr["Reports"];
    }
    if (this.printDetailobj.LanguageId == 4) {
      Direction = "en";
      finalLang = fr["Reports"];

    }
    let LanguageOptions = {
      CurrentUserLang: Direction,
      ReportsJson: finalLang
    };
    return LanguageOptions;
  }
}
