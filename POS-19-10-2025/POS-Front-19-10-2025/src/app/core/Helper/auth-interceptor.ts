import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { SpinnerService } from "../Services/Shared/Spinner/SpinnerService";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private router: Router,
    private spinnerSer: SpinnerService,
    private toastr: ToastrService,
    public datepipe: DatePipe,
    public translate: TranslateService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.spinnerSer.requestStarted();

    if (req.method.toLowerCase() != "get") {
      if (req.body && typeof req.body === "object") {
        let keys = Object.keys(req.body);
        keys.forEach((k) => {
          let ob = req.body[k];
          if (ob instanceof Date) {
            req.body[k] = this.datepipe.transform(new Date(req.body[k]), "yyyy-MM-dd HH:mm a");
          }
        });
      }
    }

    let headers = new HttpHeaders();
    if (localStorage.getItem("token") != null) {
      headers = headers.append("Authorization", "Bearer " + localStorage.getItem("token"));
    }

    headers = headers.append("Access-Control-Allow-Origin", "*");
    headers = headers.append("Access-Control-Allow-Headers", "Origin, Content-Type, X-Auth-Token, content-type");
    headers = headers.append("Access-Control-Allow-Credentials", "true");

    if (localStorage.getItem("TenantId")) headers = headers.append("TenantId", localStorage.getItem("TenantId"));
    if (localStorage.getItem("PointOfSaleDocumentId"))
      headers = headers.append("PointOfSaleDocumentId", localStorage.getItem("PointOfSaleDocumentId"));
    const ClonedReq = req.clone({ headers });

    this.spinnerSer.resetSpinner();
    return next.handle(ClonedReq).pipe(
      tap(
        (succ) => {
          if (succ instanceof HttpResponse) {
            this.spinnerSer.requestEnded();
          }
        },
        (err) => {
          if (err.status == 401) {
            localStorage.removeItem("token");
            this.router.navigateByUrl("/login");
            //this.toastr.error(err.statusText);

            this.spinnerSer.resetSpinner();
          } else if (err.status == 403) this.router.navigateByUrl("/NotAuthorized");
          else if (err.status == 400) this.handleBadRequests(err);
          else this.handleExceptionError(err);

          this.spinnerSer.resetSpinner();
        }
      )
    );
  }

  handleExceptionError(error: HttpErrorResponse) {
    const errorContent = error.error;

    if (errorContent && errorContent.Message) {
      this.toastr.error(errorContent.Message);
    } else {
      try {
        let index = errorContent.indexOf(" at ");
        //then get everything after the found index
        let strOut = errorContent.substr(0, index);

        if(strOut.toLowerCase().includes('network connection faild to access ')){
          const url = strOut.substr(strOut.indexOf("access ") + 6)
          this.toastr.warning( `${this.translate.instant("messages.networkConnectionFiald")}  ...${url}`);
        }
        else if(!strOut.toLowerCase().includes('validate order')) this.toastr.error(strOut);
      } catch (error) {
        this.toastr.error(error);
      }
    }

    return throwError(error);
  }

  handleBadRequests(error: HttpErrorResponse) {
    return throwError(error);
  }
}
