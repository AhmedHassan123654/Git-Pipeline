import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";

@Component({
  selector: "app-measl-amount",
  templateUrl: "./measl-amount.component.html",
  styleUrls: ["./measl-amount.component.scss"]
})
export class MeaslAmountComponent implements OnInit {
  radioModel = "Middle";
  language: string;
  constructor(private languageSerService: LanguageSerService, private translate: TranslateService) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  ngOnInit(): void {}
}
