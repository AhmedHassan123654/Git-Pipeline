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
exports.__esModule = true;
exports.PagetransactionsComponent = void 0;
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
var sweetalert2_1 = require("sweetalert2");
var imp = require("../pagetransactionsimport");
var en = require("assets/i18n/en.json");
var ar = require("assets/i18n/ar.json");
var print_detail_model_1 = require("src/app/core/Models/Shared/print-detail-model");
var PagetransactionsComponent = /** @class */ (function () {
  //#endregion
  //#region Constructor
  function PagetransactionsComponent(toastr, toastrMessage, http, common, router, datePipe, flagPagt, _sharedService) {
    this.toastr = toastr;
    this.toastrMessage = toastrMessage;
    this.http = http;
    this.common = common;
    this.router = router;
    this.datePipe = datePipe;
    this.flagPagt = flagPagt;
    this._sharedService = _sharedService;
    //#region Declartions
    this.fbb = true;
    this.NewEvent = new core_1.EventEmitter();
    this.returnobjEvent = new core_1.EventEmitter();
    this.clearobjEvent = new core_1.EventEmitter();
    this.quickEvents = new core_1.EventEmitter();
    this.afterPag = new core_1.EventEmitter();
    this.oading = true;
    this.options = new Stimulsoft.Viewer.StiViewerOptions();
    this.viewer = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
    this.report = new Stimulsoft.Report.StiReport();
    this.printDetailobj = new print_detail_model_1.PrintDetailModel();
    this.combovalLanguage = "";
    this.combovalPrintModel = "";
    this.combovalDestination = "";
    this.combovalfileFormat = "";
    this.ifPerview = false;
    this.languages = [
      { Id: 1, Name: "English" },
      { Id: 2, Name: "Arabic" }
    ];
    this.printModels = [];
    this.destinations = [
      { Id: 1, Name: "Preview" },
      { Id: 2, Name: "Email" }
    ];
    this.fileFormats = [{ Id: 1, Name: "PDF" }];
  }
  //#endregion
  //#region Angular Life Cycle
  PagetransactionsComponent.prototype.ngOnInit = function () {
    this.PageTransactionsFirstOpen();
    this.fields = { text: "Name", value: "Id" };
    this.printDetailobj.LanguageId = 1;
    this.printDetailobj.DestinationId = 1;
  };
  PagetransactionsComponent.prototype.getUpdatedMessage = function () {
    this.flagPagt.message.subscribe(function (res) {
      console.log("message", res);
    });
  };
  PagetransactionsComponent.prototype.setMessage = function () {
    this.flagPagt.setMessage(this._formobj.IsSync);
  };
  PagetransactionsComponent.prototype.SetFlag = function (value) {
    this._sharedService.flag = value;
  };
  //#endregion
  //#region Print
  PagetransactionsComponent.prototype.Print = function () {
    var _this = this;
    this.model = [];
    // this.currentUserLanguage = JSON.parse(
    //   localStorage.getItem('langs')
    // )?.toLowerCase();
    // if (this.currentUserLanguage == 'en') {
    //   this.model.push(this._formobj.DocumentId);
    /* let keys = Object.keys(en['default']);
  let index = keys.findIndex(x=>x == this.Printtranslation);
  this.myjson= en['default'][keys[index]]; */
    //   this.myjson = en['Reports'];
    //   this.model.push(this.myjson);
    //   this.model.push(this.currentUserLanguage);
    // }
    // if (this.currentUserLanguage == 'ar') {
    //   this.model.push(this._formobj.DocumentId);
    /* let keys = Object.keys(en['default']);
    let index = keys.findIndex(x=>x == this.Printtranslation);
    this.myjson= en['default'][keys[index]]; */
    //   this.myjson = ar['Reports'];
    //   this.model.push(this.myjson);
    //   this.model.push(this.currentUserLanguage);
    // }
    if (this.printDetailobj.LanguageId == 1) {
      this.model.push(this._formobj.DocumentId);
      this.myjson = en["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 2) {
      this.model.push(this._formobj.DocumentId);
      this.myjson = ar["Reports"];
      this.model.push(this.myjson);
      this.model.push("ar");
    }
    this.model.push(this.printDetailobj.PrintModelId);
    this.model.push(this.printDetailobj.DestinationId);
    this.model.push(this.printDetailobj.FileFormatId);
    if (this.printDetailobj.DestinationId == 2) {
      this.model.push(this.printDetailobj.Reciever);
      this.model.push(this.printDetailobj.Title);
      this.model.push(this.printDetailobj.Message);
      this.ifPerview = false;
    } else {
      this.ifPerview = true;
    }
    this._service.print(this.model).subscribe(function (data) {
      if (_this.printDetailobj.DestinationId == 2) {
        $("#modal-1").modal("hide");
        return;
      }
      _this.loading = false;
      _this.reprtresult = data;
      _this.report.loadDocument(_this.reprtresult);
      // Render report
      _this.report.renderAsync();
      // Create an HTML settings instance. You can change export settings.
      var settings = new Stimulsoft.Report.Export.StiHtmlExportSettings();
      // Create an HTML service instance.
      var service = new Stimulsoft.Report.Export.StiHtmlExportService();
      // Create a text writer objects.
      var textWriter = new Stimulsoft.System.IO.TextWriter();
      var htmlTextWriter = new Stimulsoft.Report.Export.StiHtmlTextWriter(textWriter);
      // Export HTML using text writer.
      service.exportTo(_this.report, htmlTextWriter, settings);
      //  var contents =(<HTMLInputElement>document.getElementById("FrameDIv")).innerHTML;
      var frame1 = document.createElement("iframe");
      frame1.name = "frame1";
      frame1.style.position = "absolute";
      frame1.style.top = "-10000000px";
      document.body.appendChild(frame1);
      var frameDoc = frame1.contentDocument || frame1.contentWindow.document;
      frameDoc.open();
      frameDoc.write("</head><body>");
      frameDoc.write(textWriter.getStringBuilder().toString());
      frameDoc.write("</body></html>");
      frameDoc.close();
      setTimeout(function () {
        window.frames["frame1"].focus();
        window.frames["frame1"].print();
        document.body.removeChild(frame1);
      }, 500);
      //$('#preloader-wrap').addClass('loaded');
      _this.ifPerview = false;
      $("#modal-1").modal("hide");
      return false;
    });
  };
  PagetransactionsComponent.prototype.submitData = function (submitData) {
    if (!submitData.form.valid) {
      this.toastr.warning("Enter Required Data");
      return false;
    }
    this.Print();
  };
  //#region CashReceipt Methods
  PagetransactionsComponent.prototype.PageTransactionsFirstOpen = function () {
    if (this.request.PageNumber != undefined) {
      this.pageNumber = this.request.PageNumber;
      this.count = this.request.Count;
      this.disablePaging();
      this.disableNew = true;
      this.disableEdit = true;
      this.disableDelete = true;
      this.disableSave = false;
      this.disablePrint = true;
      this.disableUndo = false;
      //  for (const name in this._frm.controls) {
      //   this._frm.controls[name].enable();
      // }
      /* this.quickMenueMode(imp.quickMode.modifyMode);
            this.quickEvents.emit(imp.quickAction.afterModify); */
    } else {
      this.pageNumber = 0;
      this.count = 0;
      this.countPaging({});
      this.quickMenueMode(imp.quickMode.queryMode);
    }
  };
  PagetransactionsComponent.prototype.Next = function () {
    if (this.pageNumber < this.count && this.pageNumber > 0) {
      ++this.pageNumber;
      this.scrPaging();
    }
  };
  PagetransactionsComponent.prototype.Previous = function () {
    if (this.pageNumber >= 1 && this.pageNumber <= this.count) {
      --this.pageNumber;
      this.scrPaging();
    }
  };
  PagetransactionsComponent.prototype.First = function () {
    if (this.pageNumber >= 1) {
      this.pageNumber = 1;
      this.scrPaging();
    }
  };
  PagetransactionsComponent.prototype.Last = function () {
    if (this.pageNumber < this.count && this.pageNumber > 0) {
      this.pageNumber = this.count;
      this.scrPaging();
    }
  };
  PagetransactionsComponent.prototype.New = function () {
    this.pageNumber = "";
    this.disablePaging();
    for (var name in this._frm.controls) {
      this._frm.controls[name].enable();
    }
    this._frm.resetForm();
    this.quickMenueMode(imp.quickMode.newMode);
    this.quickEvents.emit(imp.quickAction.afterNew);
  };
  PagetransactionsComponent.prototype.Edit = function () {
    this.disablePaging();
    for (var name in this._frm.controls) {
      this._frm.controls[name].enable();
    }
    this.quickMenueMode(imp.quickMode.modifyMode);
    this.quickEvents.emit(imp.quickAction.afterModify);
  };
  PagetransactionsComponent.prototype.save = function () {
    var _this = this;
    var _a;
    if (this.currentMode == imp.quickMode.newMode) {
      this.quickEvents.emit(imp.quickAction.beforeAdd);
      if (this._cutSave != undefined) {
        if (this._cutSave == false) {
          return;
        }
      }
      if (this._frm.valid) {
        this.newFrmObj = Object.assign({}, this._formobj);
        (_a = this._dateFields) === null || _a === void 0
          ? void 0
          : _a.forEach(function (element) {
              _this.newFrmObj[element] = _this.datePipe.transform(_this.newFrmObj[element], "MM-dd-yyyy");
            });
        this._service.Transactions(this.newFrmObj, "Post").subscribe(
          function (res) {
            if (res == 1) {
              _this.toastr.success(_this.toastrMessage.GlobalMessages(res), _this._pagename);
              _this.quickMenueMode(imp.quickMode.queryMode);
              _this.enablePaging();
              _this.countPaging({ currentAction: imp.quickAction.afterAdd });
              for (var name in _this._frm.controls) {
                _this._frm.controls[name].disable();
              }
              _this.quickEvents.emit(imp.quickAction.afterAdd);
            } else {
              _this.toastr.error(_this.toastrMessage.GlobalMessages(res), _this._pagename);
            }
          },
          function (err) {
            _this.toastr.error(_this.toastrMessage.GlobalMessages(err), _this._pagename);
          }
        );
      }
    } else {
      this.quickEvents.emit(imp.quickAction.beforeUpdate);
      if (this._frm.valid) {
        this._service.Transactions(this._formobj, "Edit").subscribe(
          function (res) {
            if (res == 2) {
              _this.toastr.info(_this.toastrMessage.GlobalMessages(res), _this._pagename);
              _this.quickMenueMode(imp.quickMode.queryMode);
              _this.enablePaging();
              // this.countPaging({ currentAction: imp.quickAction.afterAdd });
              for (var name in _this._frm.controls) {
                _this._frm.controls[name].disable();
              }
              _this.quickEvents.emit(imp.quickAction.afterUpdate);
            } else {
              _this.toastr.error(_this.toastrMessage.GlobalMessages(res), _this._pagename);
            }
          },
          function (err) {
            _this.toastr.error(_this.toastrMessage.GlobalMessages(err), _this._pagename);
          }
        );
      }
    }
  };
  PagetransactionsComponent.prototype.Delete = function () {
    var _this = this;
    sweetalert2_1["default"]
      .fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "error",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it?"
      })
      .then(function (result) {
        if (result.isConfirmed) {
          _this._service.Transactions(_this._formobj, "Delete").subscribe(
            function (res) {
              if (res == 3) {
                _this.toastr.warning(_this.toastrMessage.GlobalMessages(res), _this._pagename);
                if (_this.pageNumber != 1) {
                  if (_this.pageNumber != undefined && _this._pageNumber != "") {
                    _this.enablePaging();
                    _this.pageNumber = _this.pageNumber - 1;
                    _this.countPaging({
                      currentAction: imp.quickAction.afterDelete
                    });
                  } else if (_this.pageNumber == "") {
                    _this.pageNumber = 1;
                    _this.countPaging({
                      currentAction: imp.quickAction.afterDelete
                    });
                  }
                } else {
                  if (_this.pageNumber == 1) {
                    if (_this.count > 1) _this.enablePaging();
                    else {
                      _this.pageNumber = 0;
                      _this.disablePaging();
                      _this._frm.resetForm();
                    }
                    _this.countPaging({
                      currentAction: imp.quickAction.afterDelete
                    });
                  }
                }
                _this.quickEvents.emit(imp.quickAction.afterDelete);
              } else {
                _this.toastr.error(_this.toastrMessage.GlobalMessages(res), _this._pagename);
              }
            },
            function (err) {
              _this.toastr.error(_this.toastrMessage.GlobalMessages(err), _this._pagename);
            }
          );
        }
      });
  };
  PagetransactionsComponent.prototype.scrPaging = function () {
    var _this = this;
    this._service.Pagination(this.pageNumber).subscribe(function (res) {
      _this.returnobj = res;
      _this.afterPag.emit(_this.returnobj);
    });
  };
  PagetransactionsComponent.prototype.countPaging = function (_a) {
    var _this = this;
    var currentAction = _a.currentAction;
    if (
      this.pageNumber != undefined ||
      currentAction == imp.quickAction.afterAdd ||
      currentAction == imp.quickAction.afterDelete
    ) {
      this._service.Pagination(1).subscribe(function (res) {
        _this.returnobj = res;
        _this.count = _this.returnobj !== null ? _this.returnobj.Count : 0;
        if (_this.count == 0) _this.pageNumber = 0;
        else {
          _this.pageNumber = 1;
          if (currentAction == imp.quickAction.afterAdd) _this.pageNumber = _this.count;
          if (currentAction == imp.quickAction.afterDelete) _this.afterPag.emit(_this.returnobj);
        }
      });
    } else this.count = 0;
  };
  PagetransactionsComponent.prototype.quickMenueMode = function (mode) {
    this.currentMode = mode;
    this.changeButtonsStatus(mode);
  };
  PagetransactionsComponent.prototype.changeButtonsStatus = function (mode) {
    if (mode == imp.quickMode.queryMode) {
      this.disableNew = false;
      this.disableEdit = false;
      this.disableDelete = false;
      this.disableSave = true;
      this.disablePrint = false;
      this.disableUndo = true;
    }
    if (mode == imp.quickMode.newMode || mode == imp.quickMode.modifyMode) {
      this.disableNew = true;
      this.disableEdit = true;
      this.disableDelete = true;
      this.disableSave = false;
      this.disablePrint = true;
      this.disableUndo = false;
    }
  };
  PagetransactionsComponent.prototype.btnPrivliges = function () {
    if (this._formobj.screenPermission != undefined) {
      this.showNew = this._formobj.screenPermission.New;
      this.showEdit = this._formobj.screenPermission.Edit;
      this.showDelete = this._formobj.screenPermission.Delete;
      this.showPrint = this._formobj.screenPermission.Print;
      this.showSave = this._formobj.screenPermission.Save;
      if (this.showSave == true || this.showEdit == true) {
        this.showUndo = true;
      } else {
        this.showUndo = false;
      }
    }
  };
  PagetransactionsComponent.prototype.disablePaging = function () {
    this.disableFirst = true;
    this.disablePrevious = true;
    this.disablePageNumber = true;
    this.disableNext = true;
    this.disableLast = true;
  };
  PagetransactionsComponent.prototype.enablePaging = function () {
    this.disableFirst = false;
    this.disablePrevious = false;
    this.disablePageNumber = false;
    this.disableNext = false;
    this.disableLast = false;
  };
  //#endregion
  PagetransactionsComponent.prototype.EditEvent = function () {
    var _this = this;
    this._service.FirstOpen().subscribe(function (res) {
      var returnobj = res;
      if (returnobj.Count == 0) {
        _this.toastr.warning(_this.toastrMessage.GlobalMessages(res), _this._pagename);
        _this.count = 0;
        _this.pageNumber = 0;
      } else if (returnobj.Count == undefined) {
        _this.count = 1;
        _this.pageNumber = 1;
        _this.editBtn = false;
        return;
      } else {
        _this.count = returnobj.Count;
        if (_this._pageNumber) {
          _this.pageNumber = _this._pageNumber;
          _this.Paging();
        } else _this.pageNumber = _this.count;
      }
    });
    //
  };
  // End : Add
  // Start : Edit
  // Edit() {
  //   this.beforeupdate.emit();
  //   if (this._frm.valid) {
  //     this._service.Transactions(this._formobj, 'Edit').subscribe(
  //       (res) => {
  //         if (res == 2) {
  //           if (this._formobj.FileToUpload) {
  //             const formData = new FormData();
  //             formData.append('file', this._formobj.FileToUpload);
  //             this.http
  //               .post(this.common.rooturl + '/Branch/UploadImages', formData)
  //               .subscribe((res) => {
  //                 if (res == true)
  //                   return this.toastr.info(
  //                     this.toastrMessage.GlobalMessages(res),
  //                     this._pagename
  //                   );
  //                 else
  //                   return this.toastr.error(
  //                     this.toastrMessage.GlobalMessages(res),
  //                     this._pagename
  //                   );
  //               });
  //           } else
  //             this.toastr.info(
  //               this.toastrMessage.GlobalMessages(res),
  //               this._pagename
  //             );
  //         } else {
  //           this.toastr.error(
  //             this.toastrMessage.GlobalMessages(res),
  //             this._pagename
  //           );
  //         }
  //       },
  //       (err) => {
  //         this.toastr.error(
  //           this.toastrMessage.GlobalMessages(err),
  //           this._pagename
  //         );
  //       }
  //     );
  //   }
  // }
  // End : Edit
  //start: undo
  /* Read more about handling dismissals below */
  PagetransactionsComponent.prototype.undo = function () {
    var _this = this;
    sweetalert2_1["default"]
      .fire({
        title: "Are you sure?",
        text: "You want to Undo this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        reverseButtons: true
      })
      .then(function (result) {
        if (result.isConfirmed) {
          _this.quickMenueMode(imp.quickMode.queryMode);
          _this.pageNumber = 1;
          _this.scrPaging();
          for (var name in _this._frm.controls) {
            _this._frm.controls[name].disable();
          }
          _this.enablePaging();
          _this.quickEvents.emit(imp.quickAction.afterUndo);
        } else if (result.dismiss === sweetalert2_1["default"].DismissReason.cancel) {
          // Empty
        }
      });
  };
  __decorate([core_1.Input("form")], PagetransactionsComponent.prototype, "_frm");
  __decorate([core_1.Input("service")], PagetransactionsComponent.prototype, "_service");
  __decorate([core_1.Input("formobj")], PagetransactionsComponent.prototype, "_formobj");
  __decorate([core_1.Input("pagename")], PagetransactionsComponent.prototype, "_pagename");
  __decorate([core_1.Input("pageNumber")], PagetransactionsComponent.prototype, "_pageNumber");
  __decorate([core_1.Input("dateFields")], PagetransactionsComponent.prototype, "_dateFields");
  __decorate([core_1.Input("request")], PagetransactionsComponent.prototype, "request");
  __decorate([core_1.Input("cutsave")], PagetransactionsComponent.prototype, "_cutSave");
  __decorate([core_1.Output()], PagetransactionsComponent.prototype, "NewEvent");
  __decorate([core_1.Output()], PagetransactionsComponent.prototype, "returnobjEvent");
  __decorate([core_1.Output()], PagetransactionsComponent.prototype, "clearobjEvent");
  __decorate([core_1.Output()], PagetransactionsComponent.prototype, "quickEvents");
  __decorate([core_1.Output()], PagetransactionsComponent.prototype, "afterPag");
  PagetransactionsComponent = __decorate(
    [
      core_1.Component({
        selector: "app-pagetransactions",
        templateUrl: "./pagetransactions.component.html",
        styleUrls: ["./pagetransactions.component.css"],
        providers: [common_1.DatePipe]
      })
    ],
    PagetransactionsComponent
  );
  return PagetransactionsComponent;
})();
exports.PagetransactionsComponent = PagetransactionsComponent;
