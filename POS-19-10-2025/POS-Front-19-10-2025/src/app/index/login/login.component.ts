import { AfterViewInit, Component, Inject, OnInit, ViewChild } from "@angular/core";
import { LoginModel } from "src/app/core/Models/Authentication/login-model";
import { LoginService } from "src/app/core/Services/Authentication/login.service";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";

import { LocalstorgeService } from "src/app/localstorge.service";
import { DatabaseDetailModel } from "src/app/core/Models/Authentication/database-detail-model";
import { FileInfo } from "@syncfusion/ej2-angular-inputs";
// import { isNullOrUndefined } from "@syncfusion/ej2-base";
// import { AnimationModel } from "@syncfusion/ej2-angular-progressbar";
import { DOCUMENT } from "@angular/common";
import { WizardComponent } from "angular-wizard-form";
import { AllCountsModel } from "src/app/core/Models/Authentication/all-counts-model";
import { BranchModel } from "src/app/core/Models/Authentication/branch-model";
import { SettingModel } from "src/app/core/Models/Transactions/setting-model";
import { PointOfSalesService, SettingService } from "src/app/Features/point-of-sale/pointofsaleimports";
import { BranchService } from "src/app/Features/branch/branchimport";
import { UserLoginModel } from "src/app/core/Models/Transactions/user-login-model";
// import { LoadingBarService } from 'ngx-loading-bar';
// import { WizardComponent } from "angular-wizard-form";
// import { BranchModel } from "src/app/core/Models/Authentication/branch-model";
import { ToastrService } from "ngx-toastr";
import Swal from "sweetalert2";
import { IntegrationService } from "src/app/core/Services/Transactions/integration.service";
import Keyboard from "simple-keyboard";

declare var $: any;

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit ,AfterViewInit {
  //#region Declartions
  [key: string]: any;
  showKeyboard: boolean = false;
  @ViewChild("frmRef") frmRef;
  public responseobj: SettingModel = new SettingModel();
  public FinancialSystems: any[] = [
    { Id: 1, Name: "FERP" },
    // { Id: 2, Name: "Motakamel" },
    { Id: 3, Name: "OfLine" },
    { Id: 4, Name: "Integration System" }
  ];
  public fields = { text: "Name", value: "Id" };
  //#endregion
  // Keyboardnum: Keyboard;
  loginobj: LoginModel = new LoginModel();
  loginInput:string;

  databaseDetailobj: DatabaseDetailModel = new DatabaseDetailModel();

  showLogin: boolean = true;

  constructor(
    private LoginSer: LoginService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private settingServ: SettingService,
    private branchServ: BranchService,
    private integrationServ: IntegrationService,
    private posServ: PointOfSalesService,
    public toastr: ToastrService,
    private errorMessage: HandlingBackMessages,

    private translate: TranslateService,
    private LocalstorgeService: LocalstorgeService,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.id) {
        const TenantId = params.id;
        localStorage.setItem("TenantId", TenantId);
      }
    });
  }
  //check if an already another tab opend
  checkAnotherTabOpened() {
    setTimeout(() => {
      let tabsIndexes: string[] = this.LocalstorgeService.get('tabsIndexes');
      if (tabsIndexes?.length > 1 && localStorage.getItem("token")) {
        Swal.fire({
          title: "",
          text: this.translate.instant("messages.FERPopeninanotherwindow"),
          icon: "question",
          allowEnterKey: false,
          allowEscapeKey: false,
          allowOutsideClick: false,
          confirmButtonText: this.translate.instant("messages.UseHere")
        }).then((result) => {
          if (result.isConfirmed){
            tabsIndexes = tabsIndexes.slice(-1);
            this.LocalstorgeService.set("tabsIndexes",tabsIndexes);
            localStorage.removeItem('token');
          }
        });
      }
    }, 80);
  }

  ngOnInit() {
    let footer = document.querySelector(".float-right");

    if (!this.LocalstorgeService.get("langs")) this.translate.setDefaultLang("ar");
    else this.translate.setDefaultLang(this.LocalstorgeService.get("langs"));
    this.changeCssFile();
    this.GetAllCount();
    this.checkAnotherTabOpened();
  }

  onStep3Next(event) {
    if ((this.responseobj.FinancialSystem == 3 || this.responseobj.FinancialSystem == 4) && this.responseobj.IsMain) {
      this.showLogin = true;
      //this.responseobj.FinancialSystem=3;
      this.settingServ.SaveSettingsfromLogin(this.responseobj).subscribe((res) => {
        let branch = new BranchModel();
        branch.Name = "Defualt Branch";
        branch.IsDefault = true;
        this.branchServ.InsertBranchFromOnline(branch).subscribe((res) => {
          let Role = { Name: "Admin" };

          this.branchServ.PostRole(Role).subscribe((res) => {
            let user = {
              Password: "123456",
              UserName: "Admin",
              Role: "Admin",
              AppUserId: 1,
              UserNumber: "1",
              Pin:"123456"
            };
            if (this.responseobj.FinancialSystem == 3) {
              this.branchServ.RegisterFirstUser(user).subscribe((res) => { });
            }
            setTimeout(() => { this.insertNessaryDataForPos(); }, 3000);
            
          });
        });
      });
    } else {
      this.settingServ.UpdateFinancialSystem(this.responseobj.FinancialSystem).subscribe((res) => { });
    }
  }
  negativeValue(myValue) {
    var num = parseInt(myValue);
    if (num < 0) {
      var css = { color: "red" };
      return css;
    }
  }
  changeCssFile() {
    let langsSet: string = this.LocalstorgeService.get("langs");
    //let langsSet="en";
    let headTag = this.document.getElementsByTagName("head")[0] as HTMLHeadElement;
    let existingLink = this.document.getElementById("langCss") as HTMLLinkElement;

    let bundleName = langsSet === "ar" ? "arabicStyle.css" : "englishStyle.css";
    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      let newLink = this.document.createElement("link");
      newLink.rel = "stylesheet";
      newLink.type = "text/css";
      newLink.id = "langCss";
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }
    this.translate.setDefaultLang(langsSet);
    this.translate.use(langsSet);
    let htmlTag = this.document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.dir = langsSet === "ar" ? "rtl" : "ltr";
  }

  onFileSelect(args: any) {
    let index = [];
    let existingFiles: FileInfo[] = this.uploadObj.getFilesData();
    for (let i: number = 0; i < args.filesData.length; i++) {
      if (this.imagesTypes.indexOf(args.filesData[i].type) == -1) {
        index.push(i);
      } else {
        for (let j: number = 0; j < existingFiles.length; j++) { }
      }
    }
    for (let i = index.length - 1; i >= 0; i--) {
      args.filesData.splice(index[i], 1);
    }
    existingFiles = existingFiles.concat(args.filesData);
    args.modifiedFilesData = existingFiles;
    args.isModified = true;
  }

  progressBarLoading() {
    this.showProgressValue = true;
    this.animation = { enable: true, duration: 50000, delay: 0 };
  }

  progressBarEnd() {
    this.animation = { enable: false };
  }
  GetAllCount() {
    this.LoginSer.GetAllCounts().subscribe((res: any) => {
      if (res == false) {
        this.router.navigateByUrl("/NotAuthorized");
        return;
      }
      this.Counts = res as AllCountsModel;
      if (
        !this.Counts ||
        !this.Counts.AllBranches ||
        !this.Counts.AllUsers ||
        !this.Counts.AllOrderPayTypes ||
        !this.Counts.AllOrderTypes ||
        this.Counts.AllBranches == 0 ||
        this.Counts.AllUsers == 0 ||
        this.Counts.AllOrderPayTypes == 0 ||
        this.Counts.AllOrderTypes == 0
      ) {
        this.showLogin = false;
        // document.querySelector('.float-right').classList.add('hidden');
      } else {
        // document.querySelector('.float-right').classList.remove('hidden');
        this.showLogin = true;
      }
      if(this.showLogin == false && this.Counts?.Settings?.FinancialSystem == 4){
        this.showLogin = true;
        this.showIntegrationSystemWarning = true;
      }
      if(this.showLogin){
        this.LoginWithCard = this.Counts?.LoginByPin;
        const focusdOn = this.LoginWithCard ? 'pass' : 'username';
        setTimeout(() => { this.setFocusById(focusdOn);  }, 150);
      }
        
    });
  }

  getAllBranches() {
    this.LoginSer.GetAllBranches().subscribe((res) => {
      this.comboboxbrancheslist = res as BranchModel[];
      this.comboboxbranchesfields = { text: "Name", value: "DocumentId" };
      if (this.comboboxbrancheslist.filter((x) => x.IsDefault == true).length > 0) {
        this.ifExistBranchDefault = true;
        this.loginobj.BranchName = this.comboboxbrancheslist.filter((x) => x.IsDefault == true)[0].Name;
      } else this.ifExistBranchDefault = false;
      this.checkIfUserExists();
    });
  }
  checkIfUserExists() {
    this.LoginSer.CheckIfUserExists().subscribe((res: boolean) => {
      if (res == true) {
        if (this.ifExistBranchDefault && this.databaseDetailobj && this.databaseDetailobj.FinancialSystem != 1) {
          this.showLogin = true;
          this.loginFirst = false;
        } else if (this.ifExistBranchDefault) {
          this.showLogin = false;
          this.loginFirst = true;
        } else {
          //console.log(this.wizard.steps.length)
          //this.wizard.goToStep(this.step3);
          this.wizard.next();
          // this.wizard.next();
        }
      } else this.getPullStatus();
    });
  }

  getPullStatus() {
    this.LoginSer.GetPullStatus().subscribe((res: any) => {
      if (res) {
        if (this.ifExistBranchDefault) {
          this.showLogin = false;
          this.loginFirst = true;
        }
      }
    });
  }

  setPullStatus() {
    this.LoginSer.SetPullStatus().subscribe((res: any) => {
      if (res) {
        //this.showLogin = false;
        //this.loginFirst = true;
      }
    });
  }

  testConnection() {
    this.ShowSucceeded = false;
    this.ShowFailed = false;
    if (
      this.databaseDetailobj.Password == null ||
      this.databaseDetailobj.Password == undefined ||
      this.databaseDetailobj.UserName == null ||
      this.databaseDetailobj.UserName == undefined
    ) {
      this.databaseDetailobj.AuthenticationType = "1";
    }
    this.LoginSer.TestConnection(this.databaseDetailobj).subscribe((res: boolean) => {
      this.ShowSucceeded = res;
      if (res == false) this.ShowFailed = true;
    });
  }

  pullFromServer() {
    this.clearShowing();
    this.PullSucceed = false;
    this.showProgressPull = true;
    this.progressBarLoading();
    //this.loadingBarService.start();
    this.LoginSer.PullFromServer(this.databaseDetailobj).subscribe((res: boolean) => {
      //this.loadingBarService.complete();
      if (res == true) {
        console.log("Pull Succeed");
        this.PullSucceed = true;
        this.setPullStatus();
        this.progressBarEnd();
        this.getAllBranches();
        //this.showLogin = true;
        // if (this.databaseDetailobj.IsWithImages == true) {
        //   this.downloadImages();
        // } else
        //   this.toastr.success(this.errorMessage.GlobalMessages(res), "Login");
        //this.wizard.navigate.goToStep(3);
      } else {
        console.log("Pull Failed");
        this.PullSucceed = false;
        this.showProgressPull = false;
        this.toastr.error(this.errorMessage.GlobalMessages(res), "Login");
      }
    });
  }

  checkBranch() {
    if (this.databaseDetailobj.BranchId) {
      if (this.comboboxbrancheslist.findIndex((x) => x.DocumentId == this.databaseDetailobj.BranchId) == -1)
        this.databaseDetailobj.BranchId = null;
    }
  }

  onChange = (input: string) => {
    if (this.selectedInput == "branch_id") {
      this.combovalbranch = input;
    }
  };

  onBranchInputFocuscombo = (event: any) => {
    //this.openkeyboard();
    this.selectedInputBranch = $("#branch_id").attr("id");

    //  this.keyboard.setOptions({
    //    inputName: $('#paytype_id').attr('id')
    //  });
  };

  clearShowing() {
    this.showProgressPull = this.showProgressValue = false;
    this.ShowSucceeded = this.ShowFailed = false;
  }

  clearLocalstorage() {
    //this.LocalstorgeService.clear("langs");
  }

  submitData(event) {
    this.databaseDetailobj.FinancialSystem = this.responseobj.FinancialSystem;
    this.pullFromServer();

    // this.ShowSucceeded = false;
    // this.ShowFailed = false;
    // if (event.submitter.name == "test") this.testConnection();
    // else if (event.submitter.name == "sync") {
    //   this.LoginSer.TestConnection(this.databaseDetailobj).subscribe(
    //     (res: boolean) => {
    //       //this.ShowSucceeded = res;
    //       this.ShowSucceeded = undefined;
    //       if (res == false) {
    //         this.ShowFailed = true;
    //         this.ShowSucceeded = false;
    //       } else this.pullFromServer();
    //     }
    //   );
    // }
  }
  callkeyboard() {
    this.LoginSer.openkeyboard().subscribe(
      (res: any) => {
      },
      (err) => {
        //   this.toastr.error(this.errorMessage.LoginMessages(err), "Login");
      }
    );
    var url = "OSK:";
    self.open(url, "_top");
  }
  onSubmit(frmRef) {
    this.requestStarted = true;
    this.loginobj.LoginWithCard = this.LoginWithCard;
    if (frmRef.form.valid) {
      localStorage.removeItem("token");
      this.LoginSer.Post(this.loginobj).subscribe(
        (res: any) => {
          this.requestStarted = false;
          if (res.token != null) {
            localStorage.setItem("token", res.token);
            localStorage.removeItem("LockedScreen");
            localStorage.setItem("LicenseObj", JSON.stringify(res.LicenseObj));
            if(res.FreeSpaceInGB < 10){
              this.toastr.warning(`C: Drive free space is ${res.FreeSpaceInGB}GB please add more space`);
            }
            if (res.LicenseObj?.RemainingDays <= 10) {
              this.toastr.info(this.translate.instant("messages.LicenseRemainig") + '' + res.LicenseObj.RemainingDays + '' + this.translate.instant("messages.contactAuthor"));
            }
            let IsCloud = res.LicenseObj?.IsCloud;
            let data: any = new UserLoginModel();
            this.LoginSer.UserLogin(data).subscribe((model: any) => {
              if (!IsCloud) this.router.navigateByUrl("/home");
              else this.router.navigateByUrl("/POSDashboard");

              localStorage.setItem("UserLoginDocumentId", JSON.stringify(model));

              this.LoginSer.pullFromServerInLogin().subscribe((pullres: any) => {
              });

            });
          } else {
            // alert(this.errorMessage.LoginMessages(res));
            if(res == 5)
              this.toastr.error(this.translate.instant("messages.NotSameRegion"));
            else this.toastr.error(this.errorMessage.LoginMessages(res));
          }
        },
        (err) => {
          this.requestStarted = false;
          //     this.toastr.error(this.errorMessage.LoginMessages(err), "Login");
        }
      );
    } else this.requestStarted = false;
  }
  setFocusById(elemId) {
    this.setloginInput(elemId);
    let elem = document.getElementById(elemId);
    if (elem) elem.focus();
  }
  setloginInput(elemId) {
    this.loginInput = elemId;
  }
  clearUserData() {
    this.databaseDetailobj.UserName = undefined;
    this.databaseDetailobj.Password = undefined;
  }

  CheckedRdio() {
    // this.radiobtn =false;
  }

  onComplete(e) {
    this.LoginSer.UpdateDefaultBranch(this.databaseDetailobj).subscribe(
      (res: boolean) => {
        if (res == true) {
          this.showLogin = true;
          // this.loginFirst = true;
          this.insertNessaryDataForPos();
        }
      },
      (error) => { }
    );
  }

  insertNessaryDataForPos(){
    // insert Other nessary data for pos
    this.integrationServ.insertDefaultWorkTime().subscribe();
    this.posServ.insertDefaultPointOfSale().subscribe();
  }
  /******Keyboard function********/

  // openkeyboard() {
  //   this.Showing = true;
  // }
  closekeyboard() {
    // this.Showing = false;
  }
   ngAfterViewInit() {
     try {
       this.Keyboardnum = new Keyboard(".numberKeyboard", {
        //  onChange: (input) => this.onChangeNum(input),
         onKeyPress: (button) => this.onKeyPressNum(button),
         layout: {
           default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"]
         },
         theme: "hg-theme-default hg-layout-numeric numeric-theme",
 
         display: {
           "{bksp}": '<i class="fas fa-backspace"></i>'
         },
 
         preventMouseDownDefault: true
       });
     } catch (error) {}

  }
  onKeyPressNum(input) {
    if(!this.loginobj.LoginPassword) this.loginobj.LoginPassword = '';
    if(!this.loginobj.LoginUserName) this.loginobj.LoginUserName = '';

    if(this.LoginWithCard || this.loginInput == "pass"){
      if(input == '{bksp}' && this.loginobj.LoginPassword)
        this.loginobj.LoginPassword = this.loginobj.LoginPassword.slice(0, -1)
      else if(input != '{bksp}')
       this.loginobj.LoginPassword += input;
    }
    else{
      if(input == '{bksp}' && this.loginobj.LoginUserName)
        this.loginobj.LoginUserName = this.loginobj.LoginUserName.slice(0, -1)
      else if(input != '{bksp}')
        this.loginobj.LoginUserName += input;
    }
  }
  public next(): void {
    if (this.hasNextStep) {
      let nextStep: WizardComponent = this.steps[this.activeStepIndex + 1];
      this.activeStep.onNext.emit();
      // nextStep.isDisabled = false;
      this.activeStep = nextStep;
    }
  }

  public previous(): void {
    if (this.hasPrevStep) {
      let prevStep: WizardComponent = this.steps[this.activeStepIndex - 1];
      this.activeStep.onPrev.emit();
      // prevStep.isDisabled = false;
      this.activeStep = prevStep;
    }
  }

  public complete(): void {
    this.activeStep.onComplete.emit();
    this._isCompleted = true;
  }

  onStep2Next(event) {
    console.log(event);
  }
  checkFinancialSystem(event) {
  }
  AddUrl(data) {
    console.log(data);
    let ob: any = {};
    ob.myURL = data;
    this.LoginSer.AddFerbURL(ob).subscribe((res) => { });
  }

  UseCardClicked() {
    if (this.LoginWithCard) {
      this.LoginWithCard = false;
      setTimeout(() => { this.setFocusById('username'); }, 50);
    }
    else {
      this.LoginWithCard = true;
      this.setFocusById("pass");
    }
  }
  keyboardToggle() {
    this.showKeyboard = !this.showKeyboard;
  }
}
