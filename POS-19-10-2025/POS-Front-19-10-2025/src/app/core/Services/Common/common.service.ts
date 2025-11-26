import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "../Shared/config.service";
@Injectable({
  providedIn: "root"
})
export class CommonService {
  //readonly rooturl='api';
  readonly rooturl = this.config.getConfig();
  private messageSource = new BehaviorSubject("default message");
  currentMessage = this.messageSource.asObservable();

  constructor(private http: HttpClient, private config: ConfigService) {
    // this.getURl();
  }
  //  async getURl(){
  //  // this.rooturl = await this.getURlRoot();
  //  }
  //  getURlRoot(){
  //   return new Promise(resolve=>{
  //     this.http.get('/assets/Files/keys.json').toPromise().then((x) =>{
  //           const config = x as any;
  //           resolve(config.rooturl+ '/api');
  //           return config.rooturl+ '/api';
  //         }
  //       );
  //   });
  //  }

  changeMessage(message: string) {
    this.messageSource.next(message);
  }
}
