import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable()
export class ConfigService {
  private appConfig: any;
  private rootUrl: any;
  constructor(private http: HttpClient) {}

  loadConfig() {
    return this.http
      .get("assets/Config/appConfig.json")
      .toPromise()
      .then((res) => {
        this.appConfig = res as any;
        this.rootUrl = this.appConfig.API_URL + "/api";
      });
  }

  getConfig() {
    return this.rootUrl;
  }

  get helpPath()
  {
    return this.appConfig.HelpPath;
  }
  
}
