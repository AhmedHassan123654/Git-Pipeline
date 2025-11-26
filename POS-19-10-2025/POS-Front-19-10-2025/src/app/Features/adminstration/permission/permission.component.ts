import * as imp from "../permission-imports";
import { Component, OnInit, ViewChild } from "@angular/core";
import { ScreenPermissions, SettingService, TranslateService } from "../permission-imports";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";

@Component({
  selector: "app-permission",
  templateUrl: "./permission.component.html",
  styleUrls: ["./permission.component.css"]
})
export class PermissionComponent extends imp.general implements OnInit {
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  public editOptions: imp.EditSettingsModel;
  public gridFlag: boolean = false;
  @ViewChild("grid1") grid1: imp.GridComponent;
  @ViewChild("grid2") grid2: imp.GridComponent;
  @ViewChild("grid3") grid3: imp.GridComponent;
  @ViewChild("grid4") grid4: imp.GridComponent;
  @ViewChild("grid5") grid5: imp.GridComponent;
  @ViewChild("grid6") grid6: imp.GridComponent;
  @ViewChild("grid7") grid7: imp.GridComponent;
  language: string;
  constructor(
    public permissionService: imp.PermissionService,
    private router: imp.Router,
    public toastr: imp.ToastrService,
    public toastrMessage: imp.HandlingBackMessages,
    private translate: TranslateService,
    public languageSerService: LanguageSerService,
    public SettingSer: SettingService
  ) {
    super();
    this.initializeobjects();
    this.pageNumber = this.router.getCurrentNavigation().extras as number;
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.permissionService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.GetSettings();
  }
  undo() {
    this.permissionService.firstOpen(this.request.DocumentId).subscribe((res) => {
      this.responseobj = res as any;
      this.responseobj.POSScreenPermissions as ScreenPermissions[];
      this.responseobj.GroupId = this.request.DocumentId;
      this.Getdata();
    });
  }
  ngOnInit() {
    this.permissionService.firstOpen(this.request.DocumentId).subscribe((res: any) => {
      this.responseobj = res;
      this.responseobj.GroupId = this.request.DocumentId;
      this.Getdata();
    });
  }
  save() {
    this.MybeforAdd();
    if (
      this.responseobj.DocumentId == "" ||
      this.responseobj.DocumentId == undefined ||
      this.responseobj.DocumentId == null
    ) {
      this.permissionService.Transactions(this.responseobj, "Post").subscribe((res) => {
        if (res == 1) {
          this.toastr.success(this.toastrMessage.GlobalMessages(res));
          this.router.navigateByUrl("/PermissionGroup");
        } else if (res == 22) {
          this.toastr.error(this.toastrMessage.GlobalMessages(res));
        } else {
          this.toastr.error(this.toastrMessage.GlobalMessages(res));
        }
      });
    } else {
      this.permissionService.Transactions(this.responseobj, "Edit").subscribe((res) => {
        if (res == 2) {
          this.toastr.info(this.toastrMessage.GlobalMessages(res));
          this.router.navigateByUrl("/PermissionGroup");
        } else if (res == 22) {
          this.toastr.error(this.toastrMessage.GlobalMessages(res));
        } else {
          this.toastr.error(this.toastrMessage.GlobalMessages(res));
        }
      });
    }
    this.editOptions = {
      allowEditing: false,
      allowAdding: false,
      allowDeleting: false,
      mode: "Normal"
    };
    this.gridFlag = true;
    this.showEdit = true;
  }
  Edit() {
    this.editOptions = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: "Normal"
    };
    this.gridFlag = false;
  }

  Getdata() {
    this.initializeGrid();
    this.GetOrderTypes();
    this.GetProductGroups();
    this.GetHalls();
    this.GetPoints();
    this.GetPayTypes();
    this.GetAllScreens();
  }

  GetOrderTypes() {
    this.permissionService.GetOrderTypes().subscribe((res) => {
      this.OrderTypesList = Array<imp.MyViewModel>();

      this.OrderTypesList = res as imp.MyViewModel[];
      if (this.responseobj.POSOrderTypes != undefined) {
        this.responseobj.POSOrderTypes.forEach((item) => {
          this.OrderTypesList.forEach((item2) => {
            if (item.DocumentId == item2.DocumentId) {
              item2.IsSelected = true;
            }
          });
        });
      }
    });
  }
  GetProductGroups() {
    this.permissionService.GetProductGroups().subscribe((res) => {
      this.ProductGroupsList = Array<imp.MyViewModel>();
      this.ProductGroupsList = res as imp.MyViewModel[];
      if (this.responseobj.POSProductGroups != undefined) {
        this.responseobj.POSProductGroups.forEach((item) => {
          this.ProductGroupsList.forEach((item2) => {
            if (item.DocumentId == item2.DocumentId) {
              item2.IsSelected = true;
            }
          });
        });
      }
    });
  }

  GetHalls() {
    this.permissionService.GetHalls().subscribe((res) => {
      this.HallList = Array<imp.MyViewModel>();
      this.HallList = res as imp.MyViewModel[];
      if (this.responseobj.POSHalls != undefined) {
        this.responseobj.POSHalls.forEach((item) => {
          this.HallList.forEach((item2) => {
            if (item.DocumentId == item2.DocumentId) {
              item2.IsSelected = true;
            }
          });
        });
      }
    });
  }
  GetPoints() {
    this.permissionService.GetPoints().subscribe((res) => {
      this.PointsList = Array<imp.MyViewModel>();
      this.PointsList = res as imp.MyViewModel[];
      if (this.responseobj.POSPointOfSales != undefined) {
        this.responseobj.POSPointOfSales.forEach((item) => {
          this.PointsList.forEach((item2) => {
            if (item.DocumentId == item2.DocumentId) {
              item2.IsSelected = true;
            }
          });
        });
      }
    });
  }
  GetPayTypes() {
    this.permissionService.GetPayTypes().subscribe((res) => {
      this.PayTypesList = Array<imp.MyViewModel>();
      this.PayTypesList = res as imp.MyViewModel[];
      if (this.responseobj.POSOrderPayTypes != undefined) {
        this.responseobj.POSOrderPayTypes.forEach((item) => {
          this.PayTypesList.forEach((item2) => {
            if (item.DocumentId == item2.DocumentId) {
              item2.IsSelected = true;
            }
          });
        });
      }
    });
  }
  GetAllScreens() {
    this.permissionService.GetAllScreens().subscribe((res) => {
      this.ScreensList = [];
      this.ScreensList = res as ScreenPermissions[];
      this.ScreensList.forEach((data) => {
        data.SelectAll = false;
      });
      this.grid7.refresh();
      // translate
      this.ScreensList.forEach((item2) => {
        let tans = this.getTranslationName("Shared", item2.ScreenName);
        item2.ScreenTranslation = this.translate.instant(tans);
      });

      if (this.responseobj.POSScreenPermissions != undefined && this.responseobj.POSScreenPermissions.length > 0) {
        this.responseobj.POSScreenPermissions.forEach((item) => {
          this.ScreensList.forEach((item2) => {
            if (item.ScreenNumber == item2.ScreenNumber) {
              item2.View = item.View;
              item2.New = item.New;
              item2.Edit = item.Edit;
              item2.Delete = item.Delete;
              item2.Print = item.Print;
              item2.Archive = item.Archive;
            }
          });
        });
      }
    });
  }

  quickEvents(event: imp.quickAction): void {
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew();
        break;
      case imp.quickAction.beforeAdd:
        this.MybeforAdd();
        break;
      case imp.quickAction.afterAdd:
        this.MyAfterAdd();
        break;
      case imp.quickAction.afterModify:
        this.MyAfterModify();
        break;
      case imp.quickAction.afterUndo:
        this.MyAfterUndo();
        break;
      case imp.quickAction.beforeUpdate:
        this.MyBeforUpdate();
        break;
      case imp.quickAction.afterUpdate:
        this.MyAfterUpdate();
        break;
    }
  }

  afterPag(event) {
    this.responseobj.DocumentId = event.DocumentId;
    this.responseobj.GroupId = event.GroupId;
    //POS
    this.PointsList.forEach((item) => {
      item.IsSelected = false;
    });
    if (event.POSPointOfSales != undefined) {
      event.POSPointOfSales.forEach((item) => {
        this.PointsList.forEach((item2) => {
          if (item.DocumentId == item2.DocumentId) {
            item2.IsSelected = true;
          }
        });
      });
    }
    //OrderTypesList
    this.OrderTypesList.forEach((item) => {
      item.IsSelected = false;
    });
    if (event.POSOrderTypes != undefined) {
      event.POSOrderTypes.forEach((item) => {
        this.OrderTypesList.forEach((item2) => {
          if (item.DocumentId == item2.DocumentId) {
            item2.IsSelected = true;
          }
        });
      });
    }
    //ProductGroupsList
    this.ProductGroupsList.forEach((item) => {
      item.IsSelected = false;
    });
    if (event.POSProductGroups != undefined) {
      event.POSProductGroups.forEach((item) => {
        this.ProductGroupsList.forEach((item2) => {
          if (item.Id == item2.Id) {
            item2.IsSelected = true;
          }
        });
      });
    }

    //HallList
    this.HallList.forEach((item) => {
      item.IsSelected = false;
    });
    if (event.POSHalls != undefined) {
      event.POSHalls.forEach((item) => {
        this.HallList.forEach((item2) => {
          if (item.DocumentId == item2.DocumentId) {
            item2.IsSelected = true;
          }
        });
      });
    }
    //PayTypesList
    this.PayTypesList.forEach((item) => {
      item.IsSelected = false;
    });
    if (event.POSOrderPayTypes != undefined) {
      event.POSOrderPayTypes.forEach((item) => {
        this.PayTypesList.forEach((item2) => {
          if (item.DocumentId == item2.DocumentId) {
            item2.IsSelected = true;
          }
        });
      });
    }
    //POSUserRoleOptions
    if (event.POSUserRoleOptions != undefined) {
      this.responseobj.POSUserRoleOptions = event.POSUserRoleOptions;
    }
    if (event.POSUserRoleOptionReports != undefined) {
      this.responseobj.POSUserRoleOptionReports = event.POSUserRoleOptionReports;
    }

    //Screens
    this.ScreensList.forEach((item) => {
      item.View = false;
      item.New = false;
      item.Edit = false;
      item.Delete = false;
      item.View = false;
    });
    if (event.POSScreenPermissions != undefined) {
      event.POSScreenPermissions.forEach((item) => {
        this.ScreensList.forEach((item2) => {
          if (item.ScreenNumber == item2.ScreenNumber) {
            item2.View = item.View;
            item2.New = item.New;
            item2.Edit = item.Edit;
            item2.Delete = item.Delete;
            item2.View = item.View;
          }
        });
      });
    }
    this.grid7.refresh();
    this.grid5.refresh();
    this.grid4.refresh();
    this.grid3.refresh();
    this.grid2.refresh();
    this.grid1.refresh();
  }

  MybeforAdd() {
    this.responseobj.POSScreenPermissions = [];
    this.responseobj.POSOrderTypes = [];
    this.responseobj.POSProductGroups = [];
    this.responseobj.POSHalls = [];
    this.responseobj.POSOrderPayTypes = [];
    this.responseobj.POSPointOfSales = [];
    this.ScreensList.forEach((item) => {
      if (item.View == true) {
        item.Id = 0;
        this.responseobj.POSScreenPermissions.push(item);
      }
    });
    this.OrderTypesList.forEach((item) => {
      if (item.IsSelected == true) {
        this.responseobj.POSOrderTypes.push(item);
      }
    });
    this.ProductGroupsList.forEach((item) => {
      if (item.IsSelected == true) {
        this.responseobj.POSProductGroups.push(item);
      }
    });
    this.HallList.forEach((item) => {
      if (item.IsSelected == true) {
        this.responseobj.POSHalls.push(item);
      }
    });
    this.PointsList.forEach((item) => {
      if (item.IsSelected == true) {
        this.responseobj.POSPointOfSales.push(item);
      }
    });
    this.PayTypesList.forEach((item) => {
      if (item.IsSelected == true) {
        this.responseobj.POSOrderPayTypes.push(item);
      }
    });
  }

  MyBeforUpdate() {
    this.MybeforAdd();
    /*  // debugger
    this.responseobj.POSScreenPermissions=[]
    this.responseobj.POSOrderTypes=[]
    this.responseobj.POSProductGroups=[]
    this.responseobj.POSHalls=[]
    this.responseobj.POSOrderPayTypes=[]
    this.responseobj.POSPointOfSales=[]
   this.ScreensList.forEach(item => {
  if(item.View==true){
    item.Id=0;
    this.responseobj.POSScreenPermissions.push(item);
  }
});
this.OrderTypesList.forEach(item => {
  if(item.IsSelected==true){
    this.responseobj.POSOrderTypes.push(item);
  }
});
this.ProductGroupsList.forEach(item => {
  if(item.IsSelected==true){
    this.responseobj.POSProductGroups.push(item);
  }
});
this.HallList.forEach(item => {
  if(item.IsSelected==true){
    this.responseobj.POSHalls.push(item);
  }
});
this.PointsList.forEach(item => {
  if(item.IsSelected==true){
    this.responseobj.POSPointOfSales.push(item);
  }
});
this.PayTypesList.forEach(item => {
  if(item.IsSelected==true){
    this.responseobj.POSOrderPayTypes.push(item);
  }
}); */
  }
  MyAfterAdd() {
    this.editOptions = {
      allowEditing: false,
      allowAdding: false,
      allowDeleting: false,
      mode: "Normal"
    };
  }
  MyAfterUpdate() {}
  afterNew() {
    this.responseobj.POSUserRoleOptions.forEach((item) => {
      item.IsGranted = false;
    });
    this.responseobj.POSUserRoleOptionReports.forEach((item) => {
      item.IsGranted = false;
    });
    this.ScreensList.forEach((item) => {
      item.View = false;
      item.New = false;
      item.Edit = false;
      item.Delete = false;
      item.Print = false;
      item.Archive = false;
    });
    this.grid7.refresh();
    this.PayTypesList.forEach((item) => {
      item.IsSelected = false;
    });
    this.grid5.refresh();
    this.PointsList.forEach((item) => {
      item.IsSelected = false;
    });
    this.grid4.refresh();

    this.HallList.forEach((item) => {
      item.IsSelected = false;
    });
    this.grid3.refresh();
    this.ProductGroupsList.forEach((item) => {
      item.IsSelected = false;
    });
    this.grid2.refresh();
    this.OrderTypesList.forEach((item) => {
      item.IsSelected = false;
    });
    this.grid1.refresh();
  }
  MyAfterModify() {
    this.editOptions = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: "Normal"
    };
  }
  MyAfterUndo() {}
  toolbarClick(args: imp.ClickEventArgs): void {
    if (args.item.id === "Grid_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.grid.pdfExport();
    }
    if (args.item.id === "Grid_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.grid.excelExport();
    }
  }
  initializeGrid() {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = ["Search", "PdfExport", "ExcelExport"];
    this.editOptions = {
      allowEditing: true,
      allowAdding: true,
      allowDeleting: true,
      mode: "Normal"
    };
    this.filterOptions = {
      type: "Menu"
    };
  }

  //   public ChangeOrderTypes(args:any): void {
  //    if(this.gridFlag==true){
  // return
  //    }
  //   //  let currentRowObject: any = this.grid1.getRowObjectFromUID(args.event.target.closest('tr').getAttribute('data-uid'));
  //   //  let currentRowData: Object = currentRowObject.data;
  //   // this.OrderTypesList.forEach(item => {
  //   //   if(item.DocumentId==currentRowData["DocumentId"]){
  //   //     item.IsSelected=args.checked;
  //   //   }

  //   //  });
  //   //   this.grid1.refresh();
  //   if(args.isInteracted && args.data ){
  //     if(args.name == 'rowDeselecting'){
  //       if(args.data.length)
  //         args.data.forEach(d => { if(d) d.IsSelected= false;});
  //       else if(args.data.length == undefined)
  //         args.data.IsSelected = false;
  //     }

  //     else if(args.name == 'rowSelecting'){
  //       if(args.data.length)
  //         args.data.forEach(d => { if(d) d.IsSelected= true;});
  //       else if(args.data.length == undefined)
  //         args.data.IsSelected = true;
  //     }
  //   }

  //   }

  // public ChangeProductGroups(args:any): void {
  //   if(this.gridFlag==true){
  //     return
  //        }
  //   let currentRowObject: any = this.grid2.getRowObjectFromUID(args.event.target.closest('tr').getAttribute('data-uid'));
  //  let currentRowData: Object = currentRowObject.data;
  //  this.ProductGroupsList.forEach(item => {
  //   if(item.DocumentId==currentRowData["DocumentId"]){
  //     item.IsSelected=args.checked;
  //   }

  //  });
  //   this.grid2.refresh();
  // }

  // added another categoryName argument to pass the group list of items alongside the args to achieve the goal of selecting all itmes from the array
  // if the user checked the select all checkbox
  public ChangeAllSelections(args: any, categoryName: object[]): void {
    if (this.gridFlag) return;

    if (args.isInteracted && args.data) {
      if (args.name == "rowDeselecting") {
        if (args.data.length)
          categoryName.forEach((d) => {
            if (d) d["IsSelected"] = false;
          });
        else if (args.data.length == undefined) args.data.IsSelected = false;
      } else if (args.name == "rowSelecting") {
        if (args.data.length)
          categoryName.forEach((d) => {
            if (d) d["IsSelected"] = true;
          });
        else if (args.data.length == undefined) args.data.IsSelected = true;
      }
    }
  }

  // public ChangeHalls(args:any): void {
  //   if(this.gridFlag==true){
  //     return
  //        }
  //        let currentRowObject: any = this.grid3.getRowObjectFromUID(args.event.target.closest('tr').getAttribute('data-uid'));
  //        let currentRowData: Object = currentRowObject.data;
  //        this.HallList.forEach(item => {
  //         if(item.DocumentId==currentRowData["DocumentId"]){
  //           item.IsSelected=args.checked;
  //         }

  //        });

  //   this.grid3.refresh();
  // }
  // public ChangePoints(args:any): void {
  //   if(this.gridFlag==true){
  //     return
  //        }
  //        let currentRowObject: any = this.grid4.getRowObjectFromUID(args.event.target.closest('tr').getAttribute('data-uid'));
  //        let currentRowData: Object = currentRowObject.data;
  //        this.PointsList.forEach(item => {
  //         if(item.DocumentId==currentRowData["DocumentId"]){
  //           item.IsSelected=args.checked;
  //         }

  //        });

  //   this.grid4.refresh();
  // }
  // public ChangePayTypes(args:any): void {
  //   if(this.gridFlag==true){
  //     return
  //        }
  //        let currentRowObject: any = this.grid5.getRowObjectFromUID(args.event.target.closest('tr').getAttribute('data-uid'));
  //        let currentRowData: Object = currentRowObject.data;
  //        this.PayTypesList.forEach(item => {
  //         if(item.DocumentId==currentRowData["DocumentId"]){
  //           item.IsSelected=args.checked;
  //         }

  //        });
  //   this.grid5.refresh();
  // }
  checkboxChangeView(args: any) {
    if (this.gridFlag == true) {
      return;
    }
    let currentRowObject: any = this.grid7.getRowObjectFromUID(
      args.event.target.closest("tr").getAttribute("data-uid")
    );
    let currentRowData: Object = currentRowObject.data;
    this.ScreensList.forEach((item) => {
      if (item.ScreenNumber == currentRowData["ScreenNumber"]) {
        item.View = args.checked;
        if (args.checked == false) {
          item.New = false;
          item.Edit = false;
          item.Delete = false;
          item.Print = false;
          item.Archive = false;
        }
      }
    });

    this.grid7.refresh();
    this.calcIndeterminate();
  }
  checkboxChangeNew(args: any) {
    if (this.gridFlag == true) {
      return;
    }
    let currentRowObject: any = this.grid7.getRowObjectFromUID(
      args.event.target.closest("tr").getAttribute("data-uid")
    );
    let currentRowData: Object = currentRowObject.data;
    /*  if(currentRowData["View"]==false){
    this.ScreensList.forEach(item => {
      if(item.ScreenNumber==currentRowData["ScreenNumber"]){
        item.New=false;

      }
    });
    this.toastr.error(
      this.toastrMessage.GlobalMessages(21)
    )
  } */

    this.ScreensList.forEach((item) => {
      if (item.ScreenNumber == currentRowData["ScreenNumber"]) {
        item.View = true;
        item.New = args.checked;
      }
    });

    this.grid7.refresh();
    this.calcIndeterminate();
  }
  checkboxChangeEdit(args: any) {
    if (this.gridFlag == true) {
      return;
    }
    let currentRowObject: any = this.grid7.getRowObjectFromUID(
      args.event.target.closest("tr").getAttribute("data-uid")
    );
    let currentRowData: Object = currentRowObject.data;
    /*   if(currentRowData["View"]==false){
    this.ScreensList.forEach(item => {
      if(item.ScreenNumber==currentRowData["ScreenNumber"]){
        item.Edit=false;

      }
    });
    this.toastr.error(
      this.toastrMessage.GlobalMessages(21)
    )
  } */

    this.ScreensList.forEach((item) => {
      if (item.ScreenNumber == currentRowData["ScreenNumber"]) {
        item.View = true;
        item.Edit = args.checked;
      }
    });

    this.grid7.refresh();
    this.calcIndeterminate();
  }
  checkboxChangeDelete(args: any) {
    if (this.gridFlag == true) {
      return;
    }
    let currentRowObject: any = this.grid7.getRowObjectFromUID(
      args.event.target.closest("tr").getAttribute("data-uid")
    );
    let currentRowData: Object = currentRowObject.data;
    /*  if(currentRowData["View"]==false){
    this.ScreensList.forEach(item => {
      if(item.ScreenNumber==currentRowData["ScreenNumber"]){

        item.Delete=false;

      }
    });
    this.toastr.error(
      this.toastrMessage.GlobalMessages(21)
    )

  } */

    this.ScreensList.forEach((item) => {
      if (item.ScreenNumber == currentRowData["ScreenNumber"]) {
        item.View = true;
        item.Delete = args.checked;
      }
    });

    this.grid7.refresh();
    this.calcIndeterminate();
  }
  checkboxChangePrint(args: any) {
    if (this.gridFlag == true) {
      return;
    }
    let currentRowObject: any = this.grid7.getRowObjectFromUID(
      args.event.target.closest("tr").getAttribute("data-uid")
    );
    let currentRowData: Object = currentRowObject.data;
    /*  if(currentRowData["View"]==false){
    this.ScreensList.forEach(item => {
      if(item.ScreenNumber==currentRowData["ScreenNumber"]){
        item.Print=false;

      }
    });
    this.toastr.error(
      this.toastrMessage.GlobalMessages(21)
    )
  } */

    this.ScreensList.forEach((item) => {
      if (item.ScreenNumber == currentRowData["ScreenNumber"]) {
        item.View = true;
        item.Print = args.checked;
      }
    });

    this.grid7.refresh();
    this.calcIndeterminate();
  }
  checkboxChangeArchive(args: any) {
    if (this.gridFlag == true) {
      return;
    }
    let currentRowObject: any = this.grid7.getRowObjectFromUID(
      args.event.target.closest("tr").getAttribute("data-uid")
    );
    let currentRowData: Object = currentRowObject.data;
    /*   if(currentRowData["View"]==false){
    this.ScreensList.forEach(item => {
      if(item.ScreenNumber==currentRowData["ScreenNumber"]){
        item.Archive=false;

      }
    });
    this.toastr.error(
      this.toastrMessage.GlobalMessages(21)
    )
  } */

    this.ScreensList.forEach((item) => {
      if (item.ScreenNumber == currentRowData["ScreenNumber"]) {
        item.View = true;
        item.Archive = args.checked;
      }
    });

    this.grid7.refresh();
    this.calcIndeterminate();
  }

  checkboxChangeSelectAll(args: any) {
    if (this.gridFlag == true) {
      return;
    }
    let currentRowObject: any = this.grid7.getRowObjectFromUID(
      args.event.target.closest("tr").getAttribute("data-uid")
    );
    let currentRowData: Object = currentRowObject.data;
    /*   if(currentRowData["View"]==false){
    this.ScreensList.forEach(item => {
      if(item.ScreenNumber==currentRowData["ScreenNumber"]){
        item.Archive=false;

      }
    });
    this.toastr.error(
      this.toastrMessage.GlobalMessages(21)
    )
  } */

    this.ScreensList.forEach((item) => {
      if (item.ScreenNumber == currentRowData["ScreenNumber"]) {
        item.View = args.checked;
        item.Archive = args.checked;
        item.New = args.checked;
        item.Edit = args.checked;
        item.Delete = args.checked;
        item.Print = args.checked;
        item.SelectAll = args.checked;
      }
    });

    this.grid7.refresh();
    this.calcIndeterminate();
  }

  isAllChecked: boolean = false;
  isIndeterminate: boolean = false;

  selectAllPermissions(event: any, data: any) {
    console.log(event);
    console.log(data);
    if (event.checked) {
      this.isAllChecked = true;
      this.isIndeterminate = false;
    } else if (!event.checked) {
      this.isAllChecked = false;
      this.isIndeterminate = false;
    }
    this.ScreensList.forEach((item) => {
      item.View = event.checked;
      item.Archive = event.checked;
      item.New = event.checked;
      item.Edit = event.checked;
      item.Delete = event.checked;
      item.Print = event.checked;
      item.SelectAll = event.checked;
    });
    this.grid7.refresh();
  }

  calcIndeterminate() {
    const indeterminate = this.ScreensList.some((item) => {
      // if any of them is selected return true
      return item.View || item.Archive || item.New || item.Edit || item.Delete || item.Print || item.SelectAll;
    });

    this.isIndeterminate = this.isAllChecked ? false : true;
  }

  getTranslationName(trSection: string, name: string) {
    return trSection + "." + (name ? name.toLowerCase() : "");
  }
  GetSettings() {
    this.SettingSer.GetSettings().subscribe((res) => {
      this.settings = res as any;
    });
  }
  get disableEditPermission() {
    return !this.settings || (this.settings && this.settings.PullAllTablesFromPOS);
  }

  clampInputValue(event: any, option: any) {
    const clampedValue = Math.min(Math.max(event, 0), 100);

    option.MaxDiscountValue = clampedValue;
  }
}
