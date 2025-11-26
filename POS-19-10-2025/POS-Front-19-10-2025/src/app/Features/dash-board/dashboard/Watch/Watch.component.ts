import { Component, OnInit } from "@angular/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "src/app/Features/adminstration/permission-imports";
import { ShiftsService } from "src/app/Features/shifts/shift-imports";
import { interval } from "rxjs";
import { switchMap } from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { WatchService } from "src/app/core/Services/watch.service";

@Component({
  selector: "app-Watch",
  templateUrl: "./Watch.component.html",
  styleUrls: ["./Watch.component.css"]
})
export class WatchComponent implements OnInit {
  name = "Angular 4";
  language: string;
  date: any;
  hours: any;
  minutes: any;
  seconds: any;
  currentLocale: any;
  options: any = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hours: "true"
  };
  isTwelveHrFormat: false;
  test: any;
  constructor(
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private _ShiftsService: ShiftsService,
    private _WatchService: WatchService
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    // interval(1000)
    //   .pipe(switchMap(() => this._WatchService.getWatch()))
    //   .subscribe({
    //     next: (res: any) => {
    //       let newDate = new DatePipe("en-US");
    //       this.date = newDate.transform(res.currentDate, "d/MM/YYYY HH:mm:ss");
    //     }
    //   });

    setInterval(() => {
      const currentDate = new Date();
      this.date = currentDate.toLocaleString("en-US", { hour12: false }).replace(",", "");
    }, 1000);
  }

  ngOnInit() {}
}
