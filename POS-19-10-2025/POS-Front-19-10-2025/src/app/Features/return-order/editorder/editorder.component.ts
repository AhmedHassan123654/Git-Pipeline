import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";

@Component({
  selector: "app-editorder",
  templateUrl: "./editorder.component.html",
  styleUrls: ["./editorder.component.css"]
})
export class EditorderComponent implements OnInit {
  language: string;
  constructor(private languageSerService: LanguageSerService, public translate: TranslateService) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  ngOnInit() {}
}
