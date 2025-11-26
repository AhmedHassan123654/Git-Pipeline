import { Component, OnInit, ViewChild, Query } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { EmitType } from "@syncfusion/ej2-base";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { DatePipe } from "@angular/common";
import { Router, ActivatedRoute } from "@angular/router";
import { StockModel } from "src/app/core/Models/order/stockModel";
import { StockService } from "src/app/core/Services/Transactions/stock.service";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-stock",
  templateUrl: "./stock.component.html",
  styleUrls: ["./stock.component.scss"]
})
export class StockComponent implements OnInit {
  language: string;
  stock: any;
  stock2: any;
  pageNumber: number;

  postfunction: string = "PostStock";
  pagename: string = "Stock";
  selectedNumInput = "";
  selectedInput = "";
  comboval: string = "";
  comboboxfields: any;
  // @ViewChild("costcenter", { static: false }) costcenter: ComboBoxComponent;
  constructor(
    private http: HttpClient,
    public stockSer: StockService,
    private toastr: ToastrService,
    private toastrMessage: HandlingBackMessages,
    public datepipe: DatePipe,
    private router: Router,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    private route: ActivatedRoute
  ) {
    this.pageNumber = this.router.getCurrentNavigation().extras as number;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  ngOnInit() {
    this.stockfirstOpen();
  }

  // Start : First open
  stockfirstOpen() {
    this.stock = {};
    this.stockSer.FirstOpen().subscribe((res) => {
      this.stock = res as any;
      console.log(this.stock);

      this.comboboxfields = { text: "Name", value: "Id" };
    });
  }

  CheckEdit() {
    if (this.pageNumber > 0) {
      return true;
    } else return false;
  }

  returnobjEvent(event) {
    this.stock = event;
    //this.stock.Date = this.datepipe.transform(new Date(this.stock.Date), 'yyyy-MM-dd');
    //this.calenderValue = this.datepipe.transform(new Date(this.stock.Date), 'MM/dd/yyyy');
  }

  NewEvent(event) {
    //stockform=$event
    this.clearobject();
    this.stockfirstOpen();
  }
  // Start : First open
  clearobject() {
    this.stock = null;

    //this.calenderValue = this.datepipe.transform(new Date(this.stock.Date), 'MM/dd/yyyy');
  }
}
