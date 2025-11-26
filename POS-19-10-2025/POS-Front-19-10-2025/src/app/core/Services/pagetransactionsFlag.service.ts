import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class PagetransactionsFlagService {
  public message = new Subject<string>();

  constructor() {}

  setMessage(value) {
    this.message.next(value);
  }
}
