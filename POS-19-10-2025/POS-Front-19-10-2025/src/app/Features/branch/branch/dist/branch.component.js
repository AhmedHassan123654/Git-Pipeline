"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
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
exports.__esModule = true;
exports.BranchComponent = void 0;
var core_1 = require("@angular/core");
var imp = require("../branchimport");
var BranchComponent = /** @class */ (function (_super) {
  __extends(BranchComponent, _super);
  function BranchComponent(branchSer, router, route, common, toastr, toastrMessage) {
    var _this = _super.call(this) || this;
    _this.branchSer = branchSer;
    _this.router = router;
    _this.route = route;
    _this.common = common;
    _this.toastr = toastr;
    _this.toastrMessage = toastrMessage;
    _this.responseobj = new imp.BranchModel();
    //#endregion
    _this.imagesTypes = [
      "tiff",
      "pjp",
      "jfif",
      "gif",
      "svg",
      "bmp",
      "png",
      "jpeg",
      "svgz",
      "jpg",
      "webp",
      "ico",
      "xbm",
      "dib",
      "tif",
      "pjpeg",
      "avif"
    ];
    _this.imgURL = "";
    _this.onInputFocusNum = function (event) {
      _this.openkeyboardNum();
      _this.Keyboardnum.setOptions({
        inputName: event.target.id
      });
    };
    _this.onChangeNum = function (input) {};
    _this.onKeyPressNum = function (button) {
      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (button === "{shift}" || button === "{lock}") _this.handleShiftNum();
    };
    _this.onInputChangeNum = function (event) {
      _this.Keyboardnum.setInput(event.target.value, event.target.id);
    };
    _this.handleShiftNum = function () {
      var currentLayout = _this.Keyboardnum.options.layoutName;
      var shiftToggle = currentLayout === "default" ? "shift" : "default";
      _this.Keyboardnum.setOptions({
        layoutName: shiftToggle
      });
    };
    _this.onInputFocus = function (event) {
      _this.openkeyboard();
      _this.keyboard.setOptions({
        inputName: event.target.id
      });
    };
    _this.onInputFocuscombo = function (event) {
      _this.openkeyboard();
    };
    _this.onChange = function (input) {};
    _this.onKeyPress = function (button) {
      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (button === "{shift}" || button === "{lock}") _this.handleShift();
    };
    _this.onInputChange = function (event) {
      _this.keyboard.setInput(event.target.value, event.target.id);
    };
    _this.handleShift = function () {
      var currentLayout = _this.keyboard.options.layoutName;
      var shiftToggle = currentLayout === "default" ? "shift" : "default";
      _this.keyboard.setOptions({
        layoutName: shiftToggle
      });
    };
    _this.initializeobjects();
    return _this;
  }
  BranchComponent.prototype.ngOnInit = function () {
    var _this = this;
    document.getElementById("uplade_Img").classList.add("d-none");
    document.getElementById("upladDone").classList.remove("d-none");
    this.scrFirstOpen().subscribe(function () {
      _this.stocks = _this.responseobj.Stocks;
    });
    this.imgURL = this.common.rooturl.replace("api", "") + "StaticFiles/Images/Branch/";
  };
  // Start : First open
  /*   firstOpen() {
      this.branchSer.FirstOpen().subscribe((res) => {
        this.branchobj = res as imp.BranchModel;
        console.log(this.branchobj);
      });
    } */
  //#region Branch Methods
  BranchComponent.prototype.initializeobjects = function () {
    /*  this.responseobj = new imp.BranchModel(); */
    this.service = this.branchSer;
    this.request = this.router.getCurrentNavigation().extras;
  };
  //#endregion
  //#region Pagger
  BranchComponent.prototype.afterPag = function (event) {
    this.formPaging({ formObj: event });
  };
  //#endregion
  BranchComponent.prototype.CheckEdit = function () {
    if (this.pageNumber > 0) return true;
    else return false;
  };
  /*  onFileSelect(args: any) {

       let existingFiles: FileInfo[] = this.uploadObj.getFilesData();
       if (this.imagesTypes.indexOf(args.filesData[0].type) == -1) {
         this.branchobj.Logo = null;
         this.branchobj.FileToUpload = null;
         args.isModified = false;
       } else {
         this.branchobj.Logo = args.filesData[0].name;
         this.branchobj.FileToUpload = args.filesData[0].rawFile;
         args.modifiedFilesData = args.filesData;
         args.isModified = true;
       }
     }
    */
  // changeImage(args : any){
  //   if(args.target.files.length > 0) {
  //     if (this.imagesTypes.indexOf(args.target.files[0].type) == -1){
  //       this.branchobj.Logo = null;
  //       this.branchobj.FileToUpload = null;
  //     }
  //     else{
  //       this.branchobj.Logo = args.target.files[0].name;
  //       this.branchobj.FileToUpload = args.target.files[0];
  //     }
  //   }
  //   else{
  //     this.branchobj.Logo = null;
  //     this.branchobj.FileToUpload = null;
  //   }
  // }
  /******Keyboard function********/
  /*   ngAfterViewInit() {
        $('#preloader-wrap').addClass('loaded');

        this.Keyboardnum = new Keyboard({
          onChange: (input) => this.onChangeNum(input),
          onKeyPress: (button) => this.onKeyPressNum(button),
          layout: {
            default: ['1 2 3', '4 5 6', '7 8 9', '. 0 {bksp}']
          },
          theme: 'hg-theme-default hg-layout-numeric numeric-theme',

          display: {
            '{bksp}': '<i class="fas fa-backspace"></i>'
          },

          preventMouseDownDefault: true
        });
        this.keyboard = new Keyboard({
          onChange: (input) => this.onChange(input),
          onKeyPress: (button) => this.onKeyPress(button),

          preventMouseDownDefault: true
        });
      } */
  // Start : Keyboard Num Functions
  BranchComponent.prototype.openkeyboardNum = function () {
    this.Showingkeyboard = true;
  };
  BranchComponent.prototype.closekeyboardNum = function () {
    this.Showingkeyboard = false;
  };
  // End : Keyboard Num Functions
  // Start : Keyboard normal Functions
  BranchComponent.prototype.openkeyboard = function () {
    this.Showingkeyboard = true;
  };
  BranchComponent.prototype.closekeyboard = function () {
    this.Showingkeyboard = false;
  };
  BranchComponent.prototype.uploadImage = function (event) {
    var _this = this;
    if (event.target.files) {
      var reader = new FileReader();
      this.myfile = event.target.files;
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = function (event) {
        _this.responseobj.Logo = event.target.result;
      };
    }
  };
  BranchComponent.prototype.removeImage = function () {
    var _this = this;
    this.branchSer.RemoveImages().subscribe(function (res) {
      if (res == true) {
        _this.toastr.warning(_this.toastrMessage.GlobalMessages(3));
        _this.responseobj.Logo = null;
      }
    });
  };
  /*
       saveImage(pathImg)
       {

         this.responseobj.Logo =pathImg;
         this.branchSer.Transactions(this.responseobj,"Edit").subscribe(
            (res: any) => {
             if(res == 2){
              this.toastr.success(
                this.toastrMessage.GlobalMessages(res)
              )
             }

           },
       );
       } */
  BranchComponent.prototype.uploadFile = function () {
    var _this = this;
    /*  if (file.files.length === 0) {
           return;
         } */
    var fileToUpload = this.myfile[0];
    var formData = new FormData();
    formData.append("file", fileToUpload, fileToUpload.name);
    this.branchSer.UploadImages(formData).subscribe(function (res) {
      if (res == true) {
        _this.toastr.success(_this.toastrMessage.GlobalMessages(res));
      }
    });
  };
  __decorate([core_1.ViewChild("defaultupload")], BranchComponent.prototype, "uploadObj");
  BranchComponent = __decorate(
    [
      core_1.Component({
        selector: "app-branch",
        templateUrl: "./branch.component.html",
        styleUrls: ["./branch.component.css"]
      })
    ],
    BranchComponent
  );
  return BranchComponent;
})(imp.general);
exports.BranchComponent = BranchComponent;
