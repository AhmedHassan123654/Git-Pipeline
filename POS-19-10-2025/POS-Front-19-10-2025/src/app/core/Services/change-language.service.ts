import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
//import * as fs from 'file-system';

@Injectable({
  providedIn: "root"
})
export class ChangeLanguageService {
  constructor(public http: HttpClient) {}

  public getArJSON(): Observable<any> {
    return this.http.get("assets/i18n/ar.json");
  }
  public deleteArJSON(): Observable<any> {
    return this.http.delete("assets/i18n/ar.json");
  }
  public getEnJSON(): Observable<any> {
    return this.http.get("assets/i18n/en.json");
  }
  public getFrJSON(): Observable<any> {
    return this.http.get("assets/i18n/fr.json");
  }
  public getTuJSON(): Observable<any> {
    return this.http.get("assets/i18n/tu.json");
  }
  public Add(incomingdata: any): any {
    /*
    fs.readFile('./assets/i18n/en.json', 'utf8', function readFileCallback(err, data) {
    if (err) {
      console.log(err);
    } else {
    let   obj = JSON.parse(data); //now it an object
     let obj2=  JSON.parse(incomingdata);
     obj=obj2;
     let json = JSON.stringify(obj); //convert it back to json
      fs.writeFile("./assets/i18n/en.json", json, 'utf8');
    }
  });  */
  }
}
