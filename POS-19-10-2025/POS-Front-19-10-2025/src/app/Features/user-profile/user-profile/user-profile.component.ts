import { Component, OnInit } from "@angular/core";
import { ProfileModel } from "src/app/core/Models/Authentication/profile-model";
import { UserProfileServiceService } from "src/app/core/Services/Authentication/user-profile-service.service";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-user-profile",
  templateUrl: "./user-profile.component.html",
  styleUrls: ["./user-profile.component.css"]
})
export class UserProfileComponent implements OnInit {
  language: string;
  userprofileobj: ProfileModel = new ProfileModel();
  constructor(
    private userprofileser: UserProfileServiceService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    private toastr: ToastrService,
    private errorMessage: HandlingBackMessages
  ) {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  ngOnInit() {
    this.GetUserInfo();
  }

  GetUserInfo() {
    this.userprofileser.GetUserInfo().subscribe(
      (res: any) => {
        this.userprofileobj = res;
      },
      (err) => {
        this.toastr.error(this.errorMessage.UserProfileMessages(err), "User Profile");
      }
    );
  }
  onSubmit() {
    this.userprofileser.UpdateUserInfo(this.userprofileobj).subscribe(
      (res: any) => {
        if (res == 1) {
          this.toastr.info(this.errorMessage.UserProfileMessages(res), "User Profile");
        } else {
          this.toastr.error(this.errorMessage.UserProfileMessages(res), "User Profile");
        }
      },
      (err) => {
        this.toastr.error(this.errorMessage.UserProfileMessages(err), "User Profile");
      }
    );
  }
}
