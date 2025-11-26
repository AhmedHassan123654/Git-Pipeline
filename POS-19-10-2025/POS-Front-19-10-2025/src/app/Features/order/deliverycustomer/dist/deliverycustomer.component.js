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
exports.DeliveryCustomerComponent = void 0;
var core_1 = require("@angular/core");
var CustomerAddressModel_1 = require("src/app/core/Models/Transactions/CustomerAddressModel");
var CustomerModel_1 = require("src/app/core/Models/Transactions/CustomerModel");
var OrderHelper_1 = require("../OrderHelper");
var DeliveryCustomerComponent = /** @class */ (function (_super) {
  __extends(DeliveryCustomerComponent, _super);
  function DeliveryCustomerComponent(orderSer, toastr, settingServ, router, toastrMessage) {
    var _this = _super.call(this, settingServ, orderSer, toastr, toastrMessage, router) || this;
    _this.orderSer = orderSer;
    _this.toastr = toastr;
    _this.settingServ = settingServ;
    _this.router = router;
    _this.toastrMessage = toastrMessage;
    _this.model = new CustomerModel_1.CustomerModel();
    _this.comboboxRegionFields = {};
    _this.customerAddress = new CustomerAddressModel_1.CustomerAddressModel();
    _this.selectCustomer = new CustomerModel_1.CustomerModel();
    _this.isReadonyPrice = true;
    _this.selectedCustomer = new CustomerModel_1.CustomerModel();
    _this.selectedcustomerAddress = new CustomerAddressModel_1.CustomerAddressModel();
    _this.selectedAddress = false;
    _this.toggleStyle = false;
    return _this;
  }
  DeliveryCustomerComponent.prototype.toggleColor = function (e) {
    this.toggleStyle = !this.toggleStyle;
  };
  DeliveryCustomerComponent.prototype.ngOnInit = function () {
    var _this = this;
    this.orderSer.GetAllRegions().subscribe(function (res) {
      _this.regionList = res;
    });
    this.validationList = this.getValidationOptions();
    if (this.isAdmin == undefined || !this.userPermissions || this.userPermissions.length == 0) {
      this.orderSer.GetUserWithPermission().subscribe(function (res) {
        _this.isAdmin = res["Item1"];
        _this.userPermissions = res["Item2"];
        _this.validationList = _this.grantOptionsForUser(_this.isAdmin, _this.validationList, _this.userPermissions);
      });
    } else this.validationList = this.grantOptionsForUser(this.isAdmin, this.validationList, this.userPermissions);
    this.comboboxRegionFields = { text: "Name", value: "Id" };
  };
  DeliveryCustomerComponent.prototype.getCustomers = function () {
    var _this = this;
    if (this.model != null) {
      if (this._isDelivery) this.model.TypeOfCustomer = "Delivery";
      else this.model.TypeOfCustomer = "Credit";
      this.orderSer.GetCustomerByMobileOrName(this.model).subscribe(function (res) {
        _this.customerList = res;
      });
      if (this.customerList == null) {
        this.clear();
      }
    } else {
      this.clear();
    }
  };
  DeliveryCustomerComponent.prototype.onSubmit = function (event) {
    var _this = this;
    //alert("SUCCESS!! :-)\n\n" + JSON.stringify(this.model, null, 4));
    if (event.submitter.name == "AddCustomer") {
      var customer_1 = this.model;
      this.orderSer.GetCustomerByPhone(customer_1.Phone).subscribe(function (res) {
        if (res == true) {
          _this.toastr.warning("this Customer already exist", "Customer");
        } else {
          _this.orderSer.PostCustomer(customer_1).subscribe(function (res) {
            _this.toastr.success(_this.toastrMessage.GlobalMessages(res), "Customer");
            _this.getCustomers();
          });
        }
      });
    }
  };
  DeliveryCustomerComponent.prototype.submitAddress = function (event) {
    var _this = this;
    console.log("Address");
    if (event.submitter.name == "AddAddress") {
      this.customerAddress.CustomerId = this.selectCustomer.Id;
      this.customerAddress.CustomerDocumentId = this.selectCustomer.DocumentId;
      this.orderSer.PostCustomerAddress(this.customerAddress).subscribe(function (res) {
        if (res == 200) {
          _this.toastr.success(_this.toastrMessage.GlobalMessages(1), "CustomerAddress");
          _this.getCustomerAddress(_this.selectCustomer, null);
          //this.customerAddressList.push(this.customerAddress);
          $("#modal-40404").modal("hide");
        }
      });
    }
  };
  DeliveryCustomerComponent.prototype.submitPinCode = function (event) {
    var _this = this;
    if (event.submitter.name == "CheckPinCode") {
      this.orderSer.GetUserByPinCode(this.PinCode).subscribe(function (res) {
        if (res == true) {
          _this.isReadonyPrice = false;
        } else {
          _this.isReadonyPrice = true;
        }
        $("#modal-PinCode").modal("hide");
      });
    }
  };
  DeliveryCustomerComponent.prototype.clearPinCode = function () {
    this.PinCode = "";
  };
  DeliveryCustomerComponent.prototype.openAddress = function (Customer) {
    this.selectCustomer = Customer;
    this.customerAddress = new CustomerAddressModel_1.CustomerAddressModel();
    //location.reload();
  };
  DeliveryCustomerComponent.prototype.checkRegion = function (RegionId) {
    if (RegionId) {
      if (
        this.regionList != null &&
        this.regionList.findIndex(function (x) {
          return x.Id == RegionId;
        }) != -1
      )
        return true;
    }
    if (this.customerAddress != null && this.customerAddress.RegionId == RegionId) {
      this.customerAddress.RegionId = null;
    }
    if (this.selectedcustomerAddress != null && this.selectedcustomerAddress.RegionId == RegionId) {
      this.selectedcustomerAddress.RegionId = null;
    }
    RegionId = null;
    return false;
    //this._orderobj.DeliveryPrice=this.regionList.find(x=>x.Id==this.customerAddress.RegionId).Id;
  };
  DeliveryCustomerComponent.prototype.selectRegion = function (RegionId) {
    var _this = this;
    if (!this.checkRegion(RegionId)) {
      RegionId = null;
    }
    if (RegionId != null) {
      var RegionsDeliveryPrice_1;
      this.orderSer.GetRegionsDeliveryPrice(RegionId).subscribe(function (res) {
        RegionsDeliveryPrice_1 = res;
        if (RegionsDeliveryPrice_1 != null) {
          _this._orderobj.DeliveryPrice = RegionsDeliveryPrice_1.Price;
          _this._orderobj.DeliveryPersonDeliveryPrice = RegionsDeliveryPrice_1.PersonPrice;
        } else {
          _this._orderobj.DeliveryPrice = 0;
          _this._orderobj.DeliveryPersonDeliveryPrice = 0;
        }
      });
    } else {
      this._orderobj.DeliveryPrice = 0;
      this._orderobj.DeliveryPersonDeliveryPrice = 0;
    }
  };
  DeliveryCustomerComponent.prototype.getCustomerAddress = function (Customer, i) {
    var _this = this;
    if (i != null) {
      var iscollaps = this.customerList[i].isCollapse;
      this.customerList.forEach(function (x) {
        x.isCollapse = false;
      });
      if (!iscollaps) this.customerList[i].isCollapse = true;
      this.clearAdrress();
    }
    var addressList;
    this.orderSer.GetCustomerAddress(Customer.DocumentId).subscribe(function (res) {
      addressList = res;
      _this.customerAddressList = [];
      if (addressList != null) {
        addressList.forEach(function (element) {
          if (
            _this.customerAddressList.findIndex(function (a) {
              return a.DocumentId == element.DocumentId || a.DocumentId == null;
            }) == -1 ||
            _this.customerAddressList.length == 0
          ) {
            _this.customerAddressList.push(element);
          }
        });
      }
      _this.selectedCustomer = Customer;
    });
  };
  DeliveryCustomerComponent.prototype.clear = function () {
    this.model = new CustomerModel_1.CustomerModel();
    this.selectedAddress = false;
    this.selectedCustomer = new CustomerModel_1.CustomerModel();
    this.selectedcustomerAddress = new CustomerAddressModel_1.CustomerAddressModel();
    this.customerList = [];
    this.customerAddressList = [];
    this._orderobj.DeliveryPrice = null;
    this._orderobj.DeliveryPersonDeliveryPrice = null;
  };
  DeliveryCustomerComponent.prototype.clearAdrress = function () {
    this.selectedAddress = false;
    this.selectedcustomerAddress = new CustomerAddressModel_1.CustomerAddressModel();
    this._orderobj.DeliveryPrice = null;
    this._orderobj.DeliveryPersonDeliveryPrice = null;
  };
  DeliveryCustomerComponent.prototype.EditAddress = function () {
    var _this = this;
    this.orderSer.PutCustomerAddress(this.selectedcustomerAddress).subscribe(function (res) {
      if (res == 200) {
        _this.toastr.info(_this.toastrMessage.GlobalMessages(2), "CustomerAddress");
      }
    });
  };
  DeliveryCustomerComponent.prototype.SelectedCustomer = function () {
    if (!this.selectedcustomerAddress.DocumentId) {
      this.clear();
    } else {
      this._orderobj.CustomerId = this.selectedCustomer.Id;
      this._orderobj.CustomerDocumentId = this.selectedCustomer.DocumentId;
      this._orderobj.CustomerName = this.selectedCustomer.Name;
      this._orderobj.CustomerPhone = this.selectedCustomer.Phone;
      this._orderobj.CustomerAddressId = this.selectedcustomerAddress.Id;
      this._orderobj.CustomerAddressDocumentId = this.selectedcustomerAddress.DocumentId;
      this._orderobj.CustomerAddress = this.selectedcustomerAddress;
      this._orderobj.Customer = this.selectedCustomer;
    }
    $("#modal-40444").modal("hide");
  };
  DeliveryCustomerComponent.prototype.custAddress = function (CustomerAddress) {
    this.customerAddressList.forEach(function (x) {
      x.IsSelected = false;
    });
    this.selectedcustomerAddress = CustomerAddress;
    this.selectRegion(CustomerAddress.RegionId);
    this.selectedAddress = true;
    var index = this.customerAddressList.findIndex(function (x) {
      return x.DocumentId == CustomerAddress.DocumentId;
    });
    if (index != -1) {
      this.customerAddressList[index].IsSelected = true;
    }
  };
  DeliveryCustomerComponent.prototype.unSelectAddress = function (CustomerAddress) {
    this.clearAdrress();
    var index = this.customerAddressList.findIndex(function (x) {
      return x.DocumentId == CustomerAddress.DocumentId;
    });
    if (index != -1) {
      this.customerAddressList[index].IsSelected = false;
    }
  };
  __decorate([core_1.Input("orderobj")], DeliveryCustomerComponent.prototype, "_orderobj");
  __decorate([core_1.Input("isDelivery")], DeliveryCustomerComponent.prototype, "_isDelivery");
  DeliveryCustomerComponent = __decorate(
    [
      core_1.Component({
        selector: "app-deliverycustomer",
        templateUrl: "./deliverycustomer.component.html",
        styleUrls: ["./deliverycustomer.component.css"]
      })
    ],
    DeliveryCustomerComponent
  );
  return DeliveryCustomerComponent;
})(OrderHelper_1.OrderHelper);
exports.DeliveryCustomerComponent = DeliveryCustomerComponent;
