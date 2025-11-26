import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PraparingAndReadingOrdersService } from "src/app/core/Services/Transactions/praparing-and-reading-orders.service";
import { LanguageSerService } from "../../adminstration/permission-imports";

@Component({
  selector: "app-reading-order",
  templateUrl: "./reading-order.component.html",
  styleUrls: ["./reading-order.component.scss"]
})
export class ReadingOrderComponent implements OnInit {
  [key: string]: any;
  constructor(
    public PreparingSer: PraparingAndReadingOrdersService,
    public translate: TranslateService,
    public languageSerService: LanguageSerService
  ) {
    this.languageSerService.currentLang.subscribe((lan) => this.translate.use(lan));
  }

  ngOnInit(): void {
    this.interval = setInterval(() => {
      this.GetReadyAndPreparingNumbers();
    }, 5000);
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  GetReadyAndPreparingNumbers() {
    this.PreparingSer.GetReadyAndPreparingNumbers().subscribe((data: any) => {
      this.ReadingList = data.ReadingList;
      this.PreparingList = data.PreparingList;
    });
  }
}
