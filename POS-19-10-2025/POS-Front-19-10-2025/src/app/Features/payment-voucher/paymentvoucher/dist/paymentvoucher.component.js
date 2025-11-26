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
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) throw t[1];
          return t[1];
        },
        trys: [],
        ops: []
      },
      f,
      y,
      t,
      g;
    return (
      (g = { next: verb(0), throw: verb(1), return: verb(2) }),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (_)
        try {
          if (
            ((f = 1),
            y &&
              (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (!((t = _.trys), (t = t.length > 0 && t[t.length - 1])) && (op[0] === 6 || op[0] === 2)) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
exports.__esModule = true;
exports.PaymentvoucherComponent = void 0;
var ej2_data_1 = require("@syncfusion/ej2-data");
var imp = require("../paymentvoucher");
var core_1 = require("@angular/core");
var PaymentvoucherComponent = /** @class */ (function (_super) {
  __extends(PaymentvoucherComponent, _super);
  //#region Constructor
  function PaymentvoucherComponent(http, paymentvoucherSer, toastr, toastrMessage, router, route) {
    var _this = _super.call(this) || this;
    _this.http = http;
    _this.paymentvoucherSer = paymentvoucherSer;
    _this.toastr = toastr;
    _this.toastrMessage = toastrMessage;
    _this.router = router;
    _this.route = route;
    //Bind the filter event
    _this.onOpen = function (e) {
      if (!_this.isInitial) {
        _this.start = 11;
        _this.end = 20;
        var listElement_1 = _this.CustomerId2.list;
        listElement_1.addEventListener("scroll", function () {
          if (listElement_1.scrollTop + listElement_1.offsetHeight >= listElement_1.scrollHeight) {
            _this.start = _this.end;
            _this.end += 5;
            _this.skip = _this.start - 1;
            _this.take = _this.end - _this.skip;
            _this.paymentvoucherSer.GetAllCustomers(e.text, _this.skip, _this.take).subscribe(
              function (res) {
                _this.comboboxcustomerslist3 = res;
                _this.comboboxcustomerslist3.forEach(function (element) {
                  _this.comboboxcustomerslist2.push(element);
                });
                _this.comboboxcutomersfields2 = { text: "Name", value: "Id" };
                _this.CustomerId2.addItem(_this.comboboxcustomerslist2);
              },
              function (err) {
              }
            );
            // this.paymentvoucherSer.GetAllCustomers(e.text,this.start,this.end).map(res => res as any)
            // .subscribe(obj =>
            //   {
            //     this.comboboxcustomerslist2 = obj as any;
            //     console.log(obj)});
            // this.http.get('http://localhost:56740/api/PaymentVoucher/GetAllCustomers/'+e.text+'/'+this.start+'/'+this.end)
            // .pipe(map((user: any) =>{
            //   this.comboboxcustomerslist2 = user as any;
            // } ));
            // let filterQuery = this.CustomerId2.nativeElement.query.clone();
            // this.comboboxcustomerslist2.executeQuery(filterQuery.range(start, end)).then((event: any) => {
            //   start = end;
            //   end += 5;
            //   this.CustomerId2.nativeElement.addItem(event.result as { [key: string]: Object }[]);
            // }).catch((e: Object) => {
            // });
          }
        });
      }
    };
    _this.onFiltering = function (e) {
      _this.paymentvoucherSer.GetAllCustomers(e.text, _this.start, _this.end).subscribe(
        function (res) {
          return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
              this.comboboxcustomerslist2 = res;
              this.comboboxcutomersfields2 = { text: "Name", value: "Id" };
              return [2 /*return*/];
            });
          });
        },
        function (err) {
        }
      );
      var query = new ej2_data_1.Query();
      //frame the query based on search string with filter type.
      // query = (e.text != "") ? query.where("Country", "startswith", e.text, true) : query;
      //pass the filter data source, filter query to updateData method.
      e.updateData(_this.comboboxcustomerslist2);
    };
    //this.pageNumber=this.router.getCurrentNavigation().extras as number;
    _this.initializeobjects();
    return _this;
  }
  //#endregion
  //#region CashReceipt Methods
  PaymentvoucherComponent.prototype.initializeobjects = function () {
    this.responseobj = {};
    this.service = this.paymentvoucherSer;
    this.request = this.router.getCurrentNavigation().extras;
  };
  //#endregion
  //#region Angular Life Cycle
  PaymentvoucherComponent.prototype.ngOnInit = function () {
    this.scrFirstOpen();
    this.responseobj.CustomerOrEmployee = "1";
  };
  //#endregion
  // test
  PaymentvoucherComponent.prototype.virtualscrollable = function () {
    var _this = this;
    this.paymentvoucherSer.GetAllCustomers("f", this.start, this.end).subscribe(
      function (res) {
        _this.comboboxcustomerslist2 = res;
        _this.comboboxcutomersfields2 = { text: "Name", value: "Id" };
        _this.paymentvoucherSer.GetAllEmployees("f", _this.start, _this.end).subscribe(function (res) {
          _this.comboboxemployeesslist2 = res;
          _this.comboboxemployeesfields2 = { text: "Name", value: "Id" };
        });
      },
      function (err) {
      }
    );
  };
  //
  // Start : First open
  // paymentvoucherfirstOpen() {
  //   this.paymentvoucherSer.FirstOpen().subscribe((res) => {
  //     this.paymentvoucherobj = res as PaymentVoucherModel;
  //     console.log(this.paymentvoucherobj);
  //     this.comboboxcustomerslist = this.paymentvoucherobj.CustomerDropDownModels;
  //     if (this.paymentvoucherobj.CustomerId == 0) {
  //       this.paymentvoucherobj.CustomerId = null;
  //     }
  //     this.comboboxemployeeslist = this.paymentvoucherobj.EmployeeDropDownModels;
  //     if (this.paymentvoucherobj.EmployeeId == 0) {
  //       this.paymentvoucherobj.EmployeeId = null;
  //     }
  //     if (this.paymentvoucherobj.Amount == "0") {
  //       this.paymentvoucherobj.Amount = null;
  //     }
  //     this.comboboxcutomersfields = { text: "Name", value: "Id" };
  //     this.comboboxemployeesfields = { text: "Name", value: "Id" };
  //     this.paymentvoucherobj.CustomerOrEmployee = '1';
  //     if(this.paymentvoucherobj.Id == null ||this.paymentvoucherobj.Id == 0){
  //       this.paymentvoucherobj.Date = new Date();
  //     }
  //     else
  //       this.paymentvoucherobj.Date = this.paymentvoucherobj.Date;
  //       this.calenderValue = this.datepipe.transform(new Date(this.paymentvoucherobj.Date), 'MM/dd/yyyy');
  //   });
  // }
  // checkCustomer(){
  //   if(this.paymentvoucherobj.CustomerId){
  //     if(this.comboboxcustomerslist.findIndex(x=>x.Id==this.paymentvoucherobj.CustomerId)==-1)
  //     this.paymentvoucherobj.CustomerId=null;
  //   }
  // }
  PaymentvoucherComponent.prototype.checkEmployee = function () {
    var _this = this;
    if (this.paymentvoucherobj.EmployeeId) {
      if (
        this.comboboxemployeeslist.findIndex(function (x) {
          return x.Id == _this.paymentvoucherobj.EmployeeId;
        }) == -1
      )
        this.paymentvoucherobj.EmployeeId = null;
    }
  };
  PaymentvoucherComponent.prototype.clearData = function () {
    if (this.paymentvoucherobj.CustomerOrEmployee == "1") this.paymentvoucherobj.EmployeeId = undefined;
    else this.paymentvoucherobj.CustomerId = undefined;
  };
  // CheckEdit(){
  //   if (this.pageNumber > 0)
  //     return true;
  //   else
  //     return false;
  // }
  // tslint:disable-next-line: eofline
  PaymentvoucherComponent.prototype.openCalender = function () {
    if (this.CalenderOpened) this.CalenderOpened = false;
    else this.CalenderOpened = true;
  };
  PaymentvoucherComponent.prototype.closedCalender = function () {
    this.CalenderOpened = false;
  };
  PaymentvoucherComponent.prototype.selectDate = function () {
    //this.paymentvoucherobj.Date = this.datepipe.transform(new Date(this.calenderValue), 'yyyy-MM-dd');
    //this.calenderValue=this.calendar.value;
    //this.CalenderOpened=false;
  };
  PaymentvoucherComponent.prototype.changeDate = function (date) {
    // this.calenderValue=this.paymentvoucherobj.Date
  };
  PaymentvoucherComponent.prototype.returnobjEvent = function (event) {
    this.paymentvoucherobj = event;
    // this.paymentvoucherobj.CustomerOrEmployee = this.paymentvoucherobj.CustomerOrEmployee.toString();
    // console.log(this.paymentvoucherobj);
    // this.paymentvoucherobj.Date = this.paymentvoucherobj.Date;
    //this.calenderValue = this.datepipe.transform(new Date(this.paymentvoucherobj.Date), 'MM/dd/yyyy');
  };
  PaymentvoucherComponent.prototype.formatDate = function (date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();
    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    return [year, month, day].join("-");
  };
  PaymentvoucherComponent.prototype.NewEvent = function (event) {
    //paymentvoucherform=$event
    // this.paymentvoucherobj.Date = this.datepipe.transform(new Date(), 'yyyy-MM-dd');
    this.paymentvoucherobj.Date = new Date();
    // this.calenderValue = new Date();
    // this.paymentvoucherobj.CustomerOrEmployee = '1';
  };
  // Start : First open
  PaymentvoucherComponent.prototype.clearobject = function () {
    this.paymentvoucherobj = new imp.PaymentVoucherModel();
    (this.paymentvoucherobj.Date = new Date()), "yyyy-MM-dd";
    //this.calenderValue = this.datepipe.transform(new Date(this.paymentvoucherobj.Date), 'MM/dd/yyyy');
    this.paymentvoucherobj.CustomerOrEmployee = "1";
  };
  PaymentvoucherComponent.prototype.beforeinsert = function (event) {
    var _this = this;
    // this.paymentvoucherobj.EmpsList=[];
    // this.paymentvoucherobj.CustomerList=[];
    if (this.paymentvoucherobj.EmployeeId != null || this.paymentvoucherobj.EmployeeId == 0) {
      this.comboboxemployeesslist2.forEach(function (element) {
        if (_this.paymentvoucherobj.EmployeeId == element.Id) {
          _this.DynamicCombo.FlagValue = _this.paymentvoucherobj.EmployeeId;
          _this.DynamicCombo.FlagName = element.Name;
          _this.list.push(_this.DynamicCombo);
          _this.DynamicCombo = new imp.DynamicCombo();
        }
      });
      this.paymentvoucherobj.EmpsList = this.list;
      this.list = [];
    }
    if (this.paymentvoucherobj.CustomerId != null || this.paymentvoucherobj.CustomerId == 0) {
      this.comboboxcustomerslist2.forEach(function (element) {
        if (_this.paymentvoucherobj.CustomerId == element.Id) {
          _this.DynamicCombo.FlagValue = _this.paymentvoucherobj.CustomerId;
          _this.DynamicCombo.FlagName = element.Name;
          _this.list.push(_this.DynamicCombo);
          _this.DynamicCombo = new imp.DynamicCombo();
        }
      });
      this.paymentvoucherobj.CustomerList = this.list;
      this.list = [];
    }
  };
  __decorate([core_1.ViewChild("CustomerId2")], PaymentvoucherComponent.prototype, "CustomerId2");
  __decorate([core_1.ViewChild("calendar")], PaymentvoucherComponent.prototype, "calendar");
  PaymentvoucherComponent = __decorate(
    [
      core_1.Component({
        selector: "app-paymentvoucher",
        templateUrl: "./paymentvoucher.component.html",
        styleUrls: ["./paymentvoucher.component.css"]
      })
    ],
    PaymentvoucherComponent
  );
  return PaymentvoucherComponent;
})(imp.general);
exports.PaymentvoucherComponent = PaymentvoucherComponent;
