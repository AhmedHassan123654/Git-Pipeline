"use strict";
var __decorate =
  (this && this.__decorate) ||
  function (decorators, target, key, desc) {
    var c = arguments.length,
      r = c < 3 ? target : desc === null ? (desc = Object.getOwnPropertyDescriptor(target, key)) : desc,
      d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
      r = Reflect.decorate(decorators, target, key, desc);
    else
      for (var i = decorators.length - 1; i >= 0; i--)
        if ((d = decorators[i])) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
  };
var __param =
  (this && this.__param) ||
  function (paramIndex, decorator) {
    return function (target, key) {
      decorator(target, key, paramIndex);
    };
  };
exports.__esModule = true;
exports.LoginComponent = void 0;
var core_1 = require("@angular/core");
var login_model_1 = require("src/app/core/Models/Authentication/login-model");
var database_detail_model_1 = require("src/app/core/Models/Authentication/database-detail-model");
// import { isNullOrUndefined } from "@syncfusion/ej2-base";
// import { AnimationModel } from "@syncfusion/ej2-angular-progressbar";
var common_1 = require("@angular/common");
var LoginComponent = /** @class */ (function () {
  // isCompleted: boolean = true;
  // loginFirst: boolean = false;
  // ShowSucceeded: boolean = false;
  // ShowFailed: boolean = false;
  // PullSucceed: boolean = false;
  // selectedInput = "";
  // http: any;
  // animation: AnimationModel;
  // showProgressValue: boolean;
  // showProgressLabel = false;
  // showProgressPull = false;
  // labelName: string;
  // imagesTypes = [
  //   "tiff",
  //   "pjp",
  //   "jfif",
  //   "gif",
  //   "svg",
  //   "bmp",
  //   "png",
  //   "jpeg",
  //   "svgz",
  //   "jpg",
  //   "webp",
  //   "ico",
  //   "xbm",
  //   "dib",
  //   "tif",
  //   "pjpeg",
  //   "avif",
  // ];
  // height = 4;
  // color = "#4092F1";
  // runInterval = 200;
  // comboboxbrancheslist: any;
  // comboboxbranchesfields: Object = {};
  // Showingkeyboard: boolean = false;
  // keyboard: Keyboard;
  // selectedNumInput = "";
  // selectedInputBranch = "";
  // ifExistBranchDefault: boolean = false;
  // public path: Object = {
  //   saveUrl: this.LoginSer.UploadImages(),
  //   removeUrl: this.LoginSer.RemoveImages(),
  //   chunkSize: 102400,
  // };
  // @ViewChild("defaultupload") uploadObj: UploaderComponent;
  // @ViewChild(WizardComponent) wizard: WizardComponent;
  // then later, this works great
  function LoginComponent(
    LoginSer,
    router,
    // private toastr: ToastrService,
    errorMessage,
    // /*private LocalstorgeService:LocalstorgeService,
    // private translate: TranslateService,*/
    //private loadingBarService: LoadingBarService,
    translate,
    LocalstorgeService,
    document
  ) {
    var _this = this;
    this.LoginSer = LoginSer;
    this.router = router;
    this.errorMessage = errorMessage;
    this.translate = translate;
    this.LocalstorgeService = LocalstorgeService;
    this.document = document;
    //#endregion
    // Keyboardnum: Keyboard;
    this.loginobj = new login_model_1.LoginModel();
    this.databaseDetailobj = new database_detail_model_1.DatabaseDetailModel();
    // loadKeyboard: boolean = false;
    // Showing: boolean = false;
    this.showLogin = true;
    this.onChange = function (input) {
      if (_this.selectedInput == "branch_id") {
        _this.combovalbranch = input;
      }
    };
    this.onBranchInputFocuscombo = function (event) {
      //this.openkeyboard();
      _this.selectedInputBranch = $("#branch_id").attr("id");
      //  this.keyboard.setOptions({
      //    inputName: $('#paytype_id').attr('id')
      //  });
    };
  }
  LoginComponent.prototype.ngOnInit = function () {
    var footer = document.querySelector(".float-right");
    var hidenButton = footer === null || footer === void 0 ? void 0 : footer.classList.add("hidden");
    // hidenButton[0].style.display = "none";
    // if (localStorage.getItem("token") != null) {
    //   this.router.navigateByUrl("/dashboard");
    // }
    // this.databaseDetailobj.AuthenticationType = "1";
    // this.databaseDetailobj.IsWithImages = true;
    if (!this.LocalstorgeService.get("langs")) this.translate.setDefaultLang("ar");
    else this.translate.setDefaultLang(this.LocalstorgeService.get("langs"));
    this.changeCssFile();
    //this.checkIfUserExists();
    //   this.getAllBranches();
    //document.querySelector('.float-right').classList.remove('hidden');
    this.GetAllCount();
  };
  LoginComponent.prototype.negativeValue = function (myValue) {
    var num = parseInt(myValue);
    if (num < 0) {
      var css = { color: "red" };
      return css;
    }
  };
  LoginComponent.prototype.changeCssFile = function () {
    var langsSet = this.LocalstorgeService.get("langs");
    //let langsSet="en";
    var headTag = this.document.getElementsByTagName("head")[0];
    var existingLink = this.document.getElementById("langCss");
    var bundleName = langsSet === "ar" ? "arabicStyle.css" : "englishStyle.css";
    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      var newLink = this.document.createElement("link");
      newLink.rel = "stylesheet";
      newLink.type = "text/css";
      newLink.id = "langCss";
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }
    this.translate.setDefaultLang(langsSet);
    this.translate.use(langsSet);
    var htmlTag = this.document.getElementsByTagName("html")[0];
    htmlTag.dir = langsSet === "ar" ? "rtl" : "ltr";
  };
  LoginComponent.prototype.onFileSelect = function (args) {
    var index = [];
    var existingFiles = this.uploadObj.getFilesData();
    for (var i = 0; i < args.filesData.length; i++) {
      if (this.imagesTypes.indexOf(args.filesData[i].type) == -1) {
        index.push(i);
      } else {
        for (var j = 0; j < existingFiles.length; j++) {
          // if (!isNullOrUndefined(args.filesData[i])) {
          //   if (existingFiles[j].name == args.filesData[i].name) {
          //     index.push(i);
          //   }
          // }
        }
      }
    }
    for (var i = index.length - 1; i >= 0; i--) {
      args.filesData.splice(index[i], 1);
    }
    existingFiles = existingFiles.concat(args.filesData);
    args.modifiedFilesData = existingFiles;
    args.isModified = true;
  };
  LoginComponent.prototype.progressBarLoading = function () {
    this.showProgressValue = true;
    this.animation = { enable: true, duration: 50000, delay: 0 };
  };
  LoginComponent.prototype.progressBarEnd = function () {
    this.animation = { enable: false };
  };
  LoginComponent.prototype.GetAllCount = function () {
    var _this = this;
    this.LoginSer.GetAllCounts().subscribe(function (res) {
      _this.Counts = res;
      if (
        !_this.Counts ||
        !_this.Counts.AllBranches ||
        !_this.Counts.AllUsers ||
        !_this.Counts.AllOrderPayTypes ||
        !_this.Counts.AllOrderTypes ||
        _this.Counts.AllBranches == 0 ||
        _this.Counts.AllUsers == 0 ||
        _this.Counts.AllOrderPayTypes == 0 ||
        _this.Counts.AllOrderTypes == 0
      ) {
        _this.showLogin = false;
        // document.querySelector('.float-right').classList.add('hidden');
      } else {
        // document.querySelector('.float-right').classList.remove('hidden');
        _this.showLogin = true;
      }
    });
  };
  LoginComponent.prototype.getAllBranches = function () {
    var _this = this;
    this.LoginSer.GetAllBranches().subscribe(function (res) {
      _this.comboboxbrancheslist = res;
      _this.comboboxbranchesfields = { text: "Name", value: "Id" };
      if (
        _this.comboboxbrancheslist.filter(function (x) {
          return x.IsDefault == true;
        }).length > 0
      ) {
        _this.ifExistBranchDefault = true;
        _this.loginobj.BranchName = _this.comboboxbrancheslist.filter(function (x) {
          return x.IsDefault == true;
        })[0].Name;
      } else _this.ifExistBranchDefault = false;
      _this.checkIfUserExists();
    });
  };
  LoginComponent.prototype.checkIfUserExists = function () {
    var _this = this;
    this.LoginSer.CheckIfUserExists().subscribe(function (res) {
      if (res == true) {
        if (_this.ifExistBranchDefault) {
          _this.showLogin = false;
          _this.loginFirst = true;
        } else {
          //console.log(this.wizard.steps.length)
          //this.wizard.goToStep(this.step3);
          _this.wizard.next();
          // this.wizard.next();
        }
      } else _this.getPullStatus();
    });
  };
  LoginComponent.prototype.getPullStatus = function () {
    var _this = this;
    this.LoginSer.GetPullStatus().subscribe(function (res) {
      if (res) {
        if (_this.ifExistBranchDefault) {
          _this.showLogin = false;
          _this.loginFirst = true;
        }
      }
    });
  };
  LoginComponent.prototype.setPullStatus = function () {
    this.LoginSer.SetPullStatus().subscribe(function (res) {
      if (res) {
        //this.showLogin = false;
        //this.loginFirst = true;
      }
    });
  };
  LoginComponent.prototype.testConnection = function () {
    var _this = this;
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
    this.LoginSer.TestConnection(this.databaseDetailobj).subscribe(function (res) {
      _this.ShowSucceeded = res;
      if (res == false) _this.ShowFailed = true;
    });
  };
  LoginComponent.prototype.pullFromServer = function () {
    var _this = this;
    this.clearShowing();
    this.PullSucceed = false;
    this.showProgressPull = true;
    this.progressBarLoading();
    //this.loadingBarService.start();
    this.LoginSer.PullFromServer(this.databaseDetailobj).subscribe(function (res) {
      //this.loadingBarService.complete();
      if (res == true) {
        console.log("Pull Succeed");
        _this.PullSucceed = true;
        _this.setPullStatus();
        _this.progressBarEnd();
        _this.getAllBranches();
        //this.showLogin = true;
        // if (this.databaseDetailobj.IsWithImages == true) {
        //   this.downloadImages();
        // } else
        //   this.toastr.success(this.errorMessage.GlobalMessages(res), "Login");
        //this.wizard.navigate.goToStep(3);
      } else {
        console.log("Pull Failed");
        _this.PullSucceed = false;
        _this.showProgressPull = false;
        _this.toastr.error(_this.errorMessage.GlobalMessages(res), "Login");
      }
      // this.ShowSucceeded = res;
      // if (res == false)
      //   this.ShowFailed = true;
    });
  };
  // downloadImages() {
  //   this.LoginSer.DownloadImages().subscribe((res: boolean) => {
  //     if (res == true) {
  //       this.toastr.success("Pull And Download Images Succeed", "Login");
  //     } else {
  //       this.toastr.error(
  //         "Pull Succeed But Failed In Download Images",
  //         "Login"
  //       );
  //     }
  //   });
  // }
  LoginComponent.prototype.checkBranch = function () {
    var _this = this;
    if (this.databaseDetailobj.BranchId) {
      if (
        this.comboboxbrancheslist.findIndex(function (x) {
          return x.Id == _this.databaseDetailobj.BranchId;
        }) == -1
      )
        this.databaseDetailobj.BranchId = null;
    }
  };
  LoginComponent.prototype.clearShowing = function () {
    this.showProgressPull = this.showProgressValue = false;
    this.ShowSucceeded = this.ShowFailed = false;
  };
  LoginComponent.prototype.clearLocalstorage = function () {
    this.LocalstorgeService.clear("langs");
  };
  LoginComponent.prototype.submitData = function (event) {
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
  };
  LoginComponent.prototype.callkeyboard = function () {
    this.LoginSer.openkeyboard().subscribe(
      function (res) {
      },
      function (err) {
        //   this.toastr.error(this.errorMessage.LoginMessages(err), "Login");
      }
    );
  };
  LoginComponent.prototype.onSubmit = function () {
    var _this = this;
    this.LoginSer.Post(this.loginobj).subscribe(
      function (res) {
        if (res.token != null) {
          localStorage.setItem("token", res.token);
          _this.router.navigateByUrl("/home");
        } else {
          alert(_this.errorMessage.LoginMessages(res));
          //this.toastr.error(this.errorMessage.LoginMessages(res), "Login");
        }
      },
      function (err) {
        //     this.toastr.error(this.errorMessage.LoginMessages(err), "Login");
      }
    );
  };
  LoginComponent.prototype.clearUserData = function () {
    this.databaseDetailobj.UserName = undefined;
    this.databaseDetailobj.Password = undefined;
  };
  LoginComponent.prototype.CheckedRdio = function () {
    // this.radiobtn =false;
  };
  LoginComponent.prototype.onComplete = function (e) {
    var _this = this;
    this.LoginSer.UpdateDefaultBranch(this.databaseDetailobj).subscribe(function (res) {
      if (res == true) {
        _this.showLogin = true;
        // this.loginFirst = true;
      }
    });
  };
  /******Keyboard function********/
  // openkeyboard() {
  //   this.Showing = true;
  // }
  LoginComponent.prototype.closekeyboard = function () {
    // this.Showing = false;
  };
  LoginComponent.prototype.ngAfterViewInit = function () {
    //$("#preloader-wrap").addClass("loaded");
    // this.Keyboardnum = new Keyboard({
    //   onChange: (input) => this.onChange(input),
    //   onKeyPress: (button) => this.onKeyPress(button),
    //   layout: {
    //     default: ["1 2 3", "4 5 6", "7 8 9", "0 {bksp}"],
    //   },
    //   theme: "hg-theme-default hg-layout-numeric numeric-theme",
    //   display: {
    //     "{bksp}": '<i class="fas fa-backspace"></i>',
    //   },
    //   preventMouseDownDefault: true,
    // });
  };
  // onInputFocus = (event: any) => {
  //   this.openkeyboard();
  //   this.selectedInput = event.target.id;
  //   this.Keyboardnum.setOptions({
  //     inputName: event.target.id,
  //   });
  // };
  //   onChange = (input: string) => {
  //     if (this.selectedInput == "pass") {
  //       this.loginobj.LoginPassword = input;
  //     }
  //     if (this.selectedInput == "username") {
  //       this.loginobj.LoginUserName = input;
  //     }
  //   };
  // onKeyPress = (button: string) => {
  //   /**
  //    * If you want to handle the shift and caps lock buttons
  //    */
  //   if (button === "{shift}" || button === "{lock}") this.handleShift();
  // };
  // onInputChange = (event: any) => {
  //   this.Keyboardnum.setInput(event.target.value, event.target.id);
  // };
  // handleShift = () => {
  //   let currentLayout = this.Keyboardnum.options.layoutName;
  //   let shiftToggle = currentLayout === "default" ? "shift" : "default";
  //   this.Keyboardnum.setOptions({
  //     layoutName: shiftToggle,
  //   });
  // };
  LoginComponent.prototype.next = function () {
    if (this.hasNextStep) {
      var nextStep = this.steps[this.activeStepIndex + 1];
      this.activeStep.onNext.emit();
      // nextStep.isDisabled = false;
      this.activeStep = nextStep;
    }
  };
  LoginComponent.prototype.previous = function () {
    if (this.hasPrevStep) {
      var prevStep = this.steps[this.activeStepIndex - 1];
      this.activeStep.onPrev.emit();
      // prevStep.isDisabled = false;
      this.activeStep = prevStep;
    }
  };
  LoginComponent.prototype.complete = function () {
    this.activeStep.onComplete.emit();
    this._isCompleted = true;
  };
  LoginComponent.prototype.onStep2Next = function (event) {
    console.log(event);
  };
  LoginComponent = __decorate(
    [
      core_1.Component({
        selector: "app-login",
        templateUrl: "./login.component.html",
        styleUrls: ["./login.component.css"]
      }),
      __param(5, core_1.Inject(common_1.DOCUMENT))
    ],
    LoginComponent
  );
  return LoginComponent;
})();
exports.LoginComponent = LoginComponent;
