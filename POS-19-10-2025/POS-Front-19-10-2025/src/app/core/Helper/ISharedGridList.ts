import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { SettingService } from "../Services/Settings/SettingService";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "../Services/language-ser.service";

@Injectable({
  providedIn: "root"
  // useClass: GenericGridList,
})
export abstract class ISharedGridList {
  constructor(
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages,
    public SettingSer: SettingService,
    public router: Router,
    public translate: TranslateService,
    public languageSerService: LanguageSerService
  ) {}
}
