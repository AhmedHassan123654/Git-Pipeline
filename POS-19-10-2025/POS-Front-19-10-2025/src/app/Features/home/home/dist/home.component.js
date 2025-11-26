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
exports.HomeComponent = void 0;
var core_1 = require("@angular/core");
var point_of_sale_model_1 = require("src/app/core/Models/Transactions/point-of-sale-model");
var incoming_user_model_1 = require("src/app/core/Models/Transactions/incoming-user-model");
var common_1 = require("@angular/common");
var profile_model_1 = require("src/app/core/Models/Authentication/profile-model");
var HomeComponent = /** @class */ (function () {
  function HomeComponent(
    router,
    route,
    common,
    dashboardSer,
    errorMessage,
    translate,
    userprofileser,
    shiftSer,
    LocalstorgeService,
    document,
    toastr
  ) {
    this.router = router;
    this.route = route;
    this.common = common;
    this.dashboardSer = dashboardSer;
    this.errorMessage = errorMessage;
    this.translate = translate;
    this.userprofileser = userprofileser;
    this.shiftSer = shiftSer;
    this.LocalstorgeService = LocalstorgeService;
    this.document = document;
    this.toastr = toastr;
    this.orders = false;
    this.inputs = false;
    this.delivery = false;
    this.settings = false;
    this.dropdownInputs = false;
    this.dropdowntransaction = false;
    this.dropdowndelivery = false;
    this.status = false;
    // @ViewChild('Inputs',{static:true}) Inputs: ElementRef;
    // @ViewChild('orderr',{static:true}) orderr: ElementRef;
    this.SideMenu = false;
    this.CheckedDisabled = false;
    this.DisabledShiftOpenClass = false;
    this.pointofsaleobj = new point_of_sale_model_1.PointOfSaleModel();
    this.incominguserobj = new incoming_user_model_1.IncomingUserModel();
    this.stoppedProducts = {};
    this.promos = {};
    this.userprofileobj = new profile_model_1.ProfileModel();
    this.Showing = false;
    this.Showing3 = false;
    this.Showing2 = false;
    this.imgURL = "";
    this.result = {
      IsOpenShift: false,
      IsClosedShift: false,
      IncomingUser: {}
    };
    this.selectedInput = "";
    this.date = this.formatDate(new Date().toLocaleString());
    this.incominguserArray = [];
    this.newAttribute = {};
    this.fldArray = [];
    this.payTypes = [
      { id: 1, Name: "Cash" },
      { id: 2, Name: "Credit" },
      { id: 3, Name: "Visa" }
    ];
  }
  HomeComponent.prototype.formatDate = function (date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  };
  HomeComponent.prototype.changeCssFile = function () {
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
  HomeComponent.prototype.getAllshifts = function () {
    var _this = this;
    this.shiftSer.GetAllShifts().subscribe(function (res) {
      _this.shiftlist = res;
      _this.shift = _this.shiftlist.first();
    });
  };
  HomeComponent.prototype.addFieldValue = function () {
    this.newAttribute = { CategoryDetails: [] };
    //onsole.log(this.incominguserArray.forEach((x) => this.cashType.push(x.CashType)));
    this.incominguserArray.push(this.newAttribute);
  };
  HomeComponent.prototype.deleteFieldValue = function (index) {
    console.log(index);
    this.incominguserArray.splice(index, 1);
  };
  HomeComponent.prototype.onChangeCashType = function (index) {
    this.incominguserArray.map(function (x) {
      return x.CategoryDetails.splice(0);
    });
    // this.show+index=false;
  };
  HomeComponent.prototype.addFldValue = function (field) {
    if (!field.CategoryDetails) {
      field.CategoryDetails = [];
    }
    field.CategoryDetails.push({ CategoryId: 0, Quantity: 0 });
    // this.newAttre = {};
  };
  HomeComponent.prototype.deleteFldValue = function (index) {
    this.incominguserArray.map(function (x) {
      return x.CategoryDetails.splice(index, 1);
    });
  };
  HomeComponent.prototype.onShiftChanged = function (event) {
    this.incominguserobj.WorkTimeId = event.itemData.shift;
    console.log(event);
  };
  HomeComponent.prototype.GetUserInfo = function () {
    var _this = this;
    this.userprofileser.GetUserInfo().subscribe(
      function (res) {
        _this.userprofileobj = res;
      },
      function (err) {
        _this.toastr.error(_this.errorMessage.UserProfileMessages(err), "User Profile");
      }
    );
  };
  HomeComponent.prototype.clickEvent = function () {
    this.status = !this.status;
  };
  HomeComponent.prototype.closeNav = function () {
    this.SideMenu = false;
  };
  HomeComponent.prototype.openNav = function (e) {
    this.SideMenu = true;
    this.router.navigate(["/dashboard", { data: e }]);
  };
  HomeComponent.prototype.ngAfterViewInit = function () {};
  /* dropdown Function */
  HomeComponent.prototype.OpenDropdown = function (e) {
    if (e === "inputs") {
      if (this.dropdownInputs) {
        this.dropdownInputs = false;
      } else {
        this.dropdownInputs = true;
      }
    } else if (e === "Transaction") {
      if (this.dropdowntransaction) {
        this.dropdowntransaction = false;
      } else {
        this.dropdowntransaction = true;
      }
    } else if (e === "delivery") {
      if (this.dropdowndelivery) {
        this.dropdowndelivery = false;
      } else {
        this.dropdowndelivery = true;
      }
    }
  };
  /* function of routing from home  */
  /* inputs */
  HomeComponent.prototype.Psale = function (e) {
    this.router.navigate(["/pointofsale", { data: e }]);
  };
  HomeComponent.prototype.customerLink = function (e) {
    this.router.navigate(["/customer", { data: e }]);
  };
  HomeComponent.prototype.UserLink = function (e) {
    this.router.navigate(["/user", { data: e }]);
  };
  HomeComponent.prototype.branchLink = function (e) {
    this.router.navigate(["/branch", { data: e }]);
  };
  HomeComponent.prototype.PrinterLink = function (e) {
    this.router.navigate(["/printerList", { data: e }]);
  };
  /* orders */
  HomeComponent.prototype.orderLink = function (e) {
    this.router.navigate(["/order", { data: e }]);
  };
  HomeComponent.prototype.manageorderlistLink = function (e) {
    this.router.navigate(["/manageorderlist", { data: e }]);
  };
  HomeComponent.prototype.returnorderLink = function (e) {
    this.router.navigate(["/returnorder", { data: e }]);
  };
  HomeComponent.prototype.cashreceiptLink = function (e) {
    this.router.navigate(["/cashreceipt", { data: e }]);
  };
  HomeComponent.prototype.paymentvoucherLink = function (e) {
    this.router.navigate(["/paymentvoucher", { data: e }]);
  };
  HomeComponent.prototype.returninsurancelistLink = function (e) {
    this.router.navigate(["/returninsurancelist", { data: e }]);
  };
  HomeComponent.prototype.extraexpensesLink = function (e) {
    this.router.navigate(["/extraexpenses", { data: e }]);
  };
  HomeComponent.prototype.FollowOrderLink = function (e) {
    this.router.navigate(["/FollowOrder", { data: e }]);
  };
  HomeComponent.prototype.shiftsLink = function (e) {
    this.router.navigate(["/shifts", { data: e }]);
  };
  HomeComponent.prototype.UserGroupingLink = function (e) {
    this.router.navigate(["/UserGroup", { data: e }]);
  };
  /* drivers */
  HomeComponent.prototype.AssignDriversLink = function (e) {
    this.router.navigate(["/assigndriver", { data: e }]);
  };
  HomeComponent.prototype.drivers = function (e) {
    this.router.navigate(["/driver", { data: e }]);
  };
  /* Kds */
  HomeComponent.prototype.openKds = function () {
    this.router.navigate(["/Kds"]);
  };
  HomeComponent.prototype.openReadyOrder = function () {
    this.router.navigate(["/readyOrder"]);
  };
  HomeComponent.prototype.openCustomer = function () {
    this.router.navigate(["/customerKds"]);
  };
  /* settings */
  HomeComponent.prototype.ServerSyncLink = function (e) {
    this.router.navigate(["/serversync", { data: e }]);
  };
  HomeComponent.prototype.PrinterSettingsLink = function (e) {
    this.router.navigate(["/printersettings", { data: e }]);
  };
  HomeComponent.prototype.AdminstrationLink = function (e) {
    this.router.navigate(["/Permission", { data: e }]);
  };
  /* Report */
  HomeComponent.prototype.PosReport = function (e) {
    this.router.navigate(["/Reports", { data: e }]);
  };
  /* order */
  HomeComponent.prototype.takeAwayLink = function (e) {
    this.router.navigate(["/order", { data: e }]);
  };
  HomeComponent.prototype.openOrder = function (e) {
    this.router.navigateByUrl("/order", e);
  };
  HomeComponent.prototype.deliveryLink = function (e) {
    this.router.navigate(["/order", { data: e }]);
  };
  HomeComponent.prototype.endofdayLink = function (e) {
    this.router.navigate(["/endofday", { data: e }]);
  };
  /* stocks start */
  HomeComponent.prototype.ItemTransferRequestLink = function (e) {
    this.router.navigate(["/transferrequest", { data: e }]);
  };
  HomeComponent.prototype.RreceivingTransferLink = function (e) {
    this.router.navigate(["/RreceivingTransfer", { data: e }]);
  };
  HomeComponent.prototype.InventoryLink = function (e) {
    this.router.navigate(["/inventory", { data: e }]);
  };
  HomeComponent.prototype.IncomingLink = function (e) {
    this.router.navigate(["/incoming", { data: e }]);
  };
  HomeComponent.prototype.StockLink = function (e) {
    this.router.navigate(["/stock", { data: e }]);
  };
  /* stocks end */
  /*end function of routing from home  */
  HomeComponent.prototype.ngOnInit = function () {
    this.firstOpen();
    this.checkOpenDay();
    this.translate.setDefaultLang("en");
    this.changeCssFile();
    this.GetUserInfo();
    this.getAllshifts();
    this.getCategories();
    //this.getBestSellerProducts();
    // this.getStoppedProducts();
    // this.getAllPromos();
  };
  HomeComponent.prototype.getAllPromos = function () {
    var _this = this;
    this.dashboardSer.getAllPromos().subscribe(
      function (res) {
        _this.promos = res;
      },
      function (err) {}
    );
  };
  HomeComponent.prototype.firstOpen = function () {
    var _this = this;
    this.imgURL = this.common.rooturl.replace("api", "") + "StaticFiles/Images/Products/";
    this.dashboardSer.FirstOpen().subscribe(function (res) {
      _this.pointofsaleobj = res;
      // this.CheckedDisabled = true;
      _this.incominguserobj.OpenBalance = 0;
    });
  };
  HomeComponent.prototype.getStoppedProducts = function () {
    var _this = this;
    this.dashboardSer.getStoppedProducts().subscribe(
      function (res) {
        _this.stoppedProducts = res;
      },
      function (err) {}
    );
  };
  HomeComponent.prototype.getBestSellerProducts = function () {
    var _this = this;
    this.dashboardSer.getBestSellerProducts().subscribe(
      function (res) {
        _this.bestSeller = res;
      },
      function (err) {
        _this.toastr.error(_this.errorMessage.GlobalMessages(err), "getBestSellerProducts");
      }
    );
  };
  HomeComponent.prototype.checkOpenDay = function () {
    var _this = this;
    this.dashboardSer.checkUnclosedShiftfromUser().subscribe(function (res) {
      _this.result = res;
      if (_this.result.IsOpenShift === true) {
        _this.DisabledShiftOpenClass = true;
        _this.CheckedDisabled = false;
        _this.incominguserobj = _this.result.IncomingUser;
      }
      if (_this.result.IsClosedShift === true) {
        _this.CheckedDisabled = true;
        _this.DisabledShiftOpenClass = false;
        _this.incominguserobj = new incoming_user_model_1.IncomingUserModel();
      } else if (_this.result.IsClosedShift === false && _this.result.IsOpenShift === false) {
        _this.CheckedDisabled = true;
        _this.DisabledShiftOpenClass = false;
        _this.incominguserobj = new incoming_user_model_1.IncomingUserModel();
      }
      _this.dashboardSer.getAllUsersInfo().subscribe(function (res) {
        _this.users = res;
      });
    });
  };
  HomeComponent.prototype.RedirectTo = function (Rout) {
    this.router.navigateByUrl("/" + Rout);
  };
  HomeComponent.prototype.getCategories = function () {
    var _this = this;
    this.dashboardSer.GetCategories().subscribe(function (res) {
      _this.categories = res;
    });
  };
  HomeComponent.prototype.openShift = function () {
    var _this = this;
    this.incominguserobj.PointOfSaleId = this.pointofsaleobj.Id;
    // this.incominguserobj.WorkTimeId = this.shift.Id;
    this.dashboardSer.OpenDay(this.incominguserobj).subscribe(
      function (res) {
        _this.errorMessage.GlobalMessages(res);
        if (res == 1) {
          $("#openshiftmodal").modal("hide");
          _this.checkOpenDay();
        }
      },
      function (err) {
        _this.toastr.error(_this.errorMessage.GlobalMessages(err), "Open Shift");
      }
    );
  };
  HomeComponent.prototype.endShift = function () {
    var _this = this;
    this.incominguserArray.forEach(function (x) {
      return (x.PointOfSaleId = _this.pointofsaleobj.Id);
    });
    this.incominguserArray.forEach(function (x) {
      return (x.WorkTimeId = _this.shift.Id);
    });
    this.incominguserArray.forEach(function (x) {
      return (x.UserName = _this.userprofileobj.UserNumber);
    });
    this.incominguserArray.forEach(function (x) {
      return (x.UserId = _this.userprofileobj.AppUserId);
    });
    // this.incominguserArray.map((x)=>x.ReceivedUserId= this.shift.Id) ;
    /* if (!this.incominguserobj.ReceivedUserPin) {
          this.toastr.error("Enter your pin");
          return false;
        } */
    /*   var user = this.users.filter(
            (x) => x.AppUserId == this.incominguserobj.ReceivedUserId
          )[0];
          if (user.Pin != this.incominguserobj.ReceivedUserPin) {
            this.toastr.error("Wrong pin");
            return false;
          } */
    this.dashboardSer.EndShift(this.incominguserArray).subscribe(
      function (res) {
        _this.errorMessage.GlobalMessages(res);
        if (res == 1) {
          $("#modal-420111024").modal("hide");
          $("#endshiftmodal").modal("hide");
          _this.checkOpenDay();
          _this.incominguserArray = [];
          _this.toastr.success("Done");
        }
      },
      function (err) {
        _this.toastr.error(_this.errorMessage.GlobalMessages(err), "Open Shift");
      }
    );
  };
  HomeComponent = __decorate(
    [
      core_1.Component({
        selector: "app-home",
        templateUrl: "./home.component.html",
        styleUrls: ["./home.component.css"]
      }),
      __param(9, core_1.Inject(common_1.DOCUMENT))
    ],
    HomeComponent
  );
  return HomeComponent;
})();
exports.HomeComponent = HomeComponent;
