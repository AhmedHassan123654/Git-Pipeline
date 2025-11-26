import { BrowserModule } from "@angular/platform-browser";
import { APP_INITIALIZER, NgModule } from "@angular/core";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { IndexModule } from "./index/index.module";
import { CoreModule } from "./core/core.module";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ToastrModule } from "ngx-toastr";
import { FormWizardModule } from "angular-wizard-form";
import { DatePipe, registerLocaleData } from "@angular/common";
import localeFr from '@angular/common/locales/fr';
import { HttpClientModule } from "@angular/common/http";

import { TranslateService } from "@ngx-translate/core";
import { SharedService } from "./core/Services/Transactions/SharedService ";
import { ConfigService } from "./core/Services/Shared/config.service";
import { EditStyleService } from "./core/Services/Shared/edit-style.service";
import { EmailSettingComponent } from "./Features/email-setting/email-setting.component";
import { NewsComponent } from "./Features/news/news.component";
import { MatIconModule } from "@angular/material/icon";
// Register the 'fr' locale data
registerLocaleData(localeFr, 'fr-FR');
const appConfig = (config: ConfigService) => {
  return () => {
    return config.loadConfig();
  };
};

@NgModule({
  declarations: [AppComponent, EmailSettingComponent, NewsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    IndexModule,
    CoreModule,
    BrowserAnimationsModule,
    FormWizardModule,
    ToastrModule.forRoot({preventDuplicates: true}),
    HttpClientModule,
    MatIconModule
  ],
  providers: [
    EditStyleService,
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: appConfig,
      multi: true,
      deps: [ConfigService]
    },
    TranslateService,
    DatePipe,
    SharedService
  ],

  bootstrap: [AppComponent]
})
export class AppModule {}
