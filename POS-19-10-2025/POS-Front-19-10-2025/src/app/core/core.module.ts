import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { AuthInterceptor } from "./Helper/auth-interceptor";
import { SharedModule } from "../shared/shared.module";
import { EditStyleService } from "./Services/Shared/edit-style.service";

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule, SharedModule],
  providers: [
    EditStyleService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ]
})
export class CoreModule {}
