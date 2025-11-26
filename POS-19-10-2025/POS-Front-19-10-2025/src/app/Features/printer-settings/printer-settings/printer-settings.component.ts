import { Component, OnInit } from "@angular/core";
import { SettingService } from "src/app/core/Services/Settings/SettingService";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-printer-settings",
  templateUrl: "./printer-settings.component.html",
  styleUrls: ["./printer-settings.component.css"]
})
export class PrinterSettingsComponent implements OnInit {
  networkPrinters: any;
  serverPrinters: any;
  language: string;
  constructor(
    public serv: SettingService,
    private toastr: ToastrService,
    private toastrMessage: HandlingBackMessages,
    private languageSerService: LanguageSerService,
    public translate: TranslateService
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  ngOnInit() {
    this.GetServerPrinters();
  }
  GetNetworkPrinters() {
    this.serv.GetNetworkPrinters().subscribe((res) => {
      this.networkPrinters = res;
    });
  }
  GetServerPrinters() {
    this.serv.GetServerPrinters().subscribe((res) => {
      this.serverPrinters = res;
      this.GetNetworkPrinters();
    });
  }
  save() {
    this.serv.Save(this.serverPrinters).subscribe(
      (res) => {
        if (res == 1) {
          this.toastr.success(this.toastrMessage.GlobalMessages(1), "printersettings");
        } else {
          this.toastr.error(this.toastrMessage.GlobalMessages(5), "printersettings");
        }
      },
      (err) => {
        this.toastr.error(this.toastrMessage.GlobalMessages(5), "printersettings");
      }
    );
  }
}
