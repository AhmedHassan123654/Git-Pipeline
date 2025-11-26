import { HttpHandler, HttpClient } from "@angular/common/http";
import { Pipe, PipeTransform } from "@angular/core";
import { Observable, throwError, of } from "rxjs";
import { catchError } from "rxjs/operators";

@Pipe({
  name: "defaultImg"
})
export class DefaultImgPipe implements PipeTransform {
  // imgUR:string='imgURL + P.PicturePath';
  transform(imgURl: string, placeholder: string) {
    if (this.checkURL(imgURl)) return imgURl;
    else return placeholder;
  }
  checkURL(url) {
    return url.match(/\.(jpeg|jpg|gif|png)$/) != null;
  }
}
