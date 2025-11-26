import { Injectable } from "@angular/core";
import { UserProfileServiceService } from "../Authentication/user-profile-service.service";

declare var $: any;
@Injectable({
  providedIn: "root"
})
export class EditStyleService {
  constructor(public userServ: UserProfileServiceService) {}
  saveActiveColor(e: any) {
    if (
      $("body").is(
        ".pink-font-theme, .white-font-theme ,.green-font-theme,.yellow-font-theme,.blue-font-theme,.orange-font-theme"
      )
    ) {
      $("body").removeClass(
        "pink-font-theme  white-font-theme  green-font-theme yellow-font-theme blue-font-theme orange-font-theme"
      );
      $("body").addClass(e + "-font-theme");
      this.userServ.UpdateUserStyle({ Color: e + "-font-theme" }).subscribe(
        (res) => {},
        (error) => {
          // $("body").addClass("pink-font-theme");
        }
      );
    } else {
      $("body").addClass(e + "-font-theme");
    }
  }
  setActiveColor(className: string) {
    $("body").removeClass(
      "pink-font-theme white-font-theme green-font-theme yellow-font-theme blue-font-theme orange-font-theme"
    );
    $("body").addClass(className);
    if (className == "reset") {
      $("body").removeClass(
        "pink-font-theme white-font-theme green-font-theme yellow-font-theme blue-font-theme orange-font-theme"
      );
    }
  }
}
