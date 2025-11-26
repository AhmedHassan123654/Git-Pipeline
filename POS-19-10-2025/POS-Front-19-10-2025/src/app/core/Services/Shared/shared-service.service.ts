import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class SharedServiceService {
  GetReport: BehaviorSubject<any> = new BehaviorSubject(false);
  constructor() {}
}
