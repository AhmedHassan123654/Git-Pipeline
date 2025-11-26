import { Component, ViewChild } from "@angular/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";

import * as imp from "../../permission-imports";

@Component({
  selector: "app-user-group-per-mission",
  templateUrl: "./user-group-per-mission.component.html",
  styleUrls: ["./user-group-per-mission.component.scss"]
})
export class UserGroupPerMissionComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  //#endregion
  constructor(
    public usergroupService: imp.UsergroupserviceService,
    private toastr: imp.ToastrService,
    private toastrMessage: imp.HandlingBackMessages,
    private router: imp.Router,
    public dashboardSer: imp.DashboardService,
    private languageSerService: LanguageSerService,
    private translate: imp.TranslateService
  ) {
    super();
    this.initializeobjects();
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  ngOnInit() {
    this.scrFirstOpen().subscribe(() => {
      /*   if( this.responseobj.Users != undefined && this.responseobj.Users != null){
        this.userGroupList.forEach(item => {
          this.responseobj.Users.forEach(item2 => {
              if(item.AppUserId==item2.AppUserId){
                item.IsSelected=true;
              }
            });
          });
      }
      else {
        this.userGroupList.forEach(item => {
          item.IsSelected=false;
        });
      }

      this.editOptions = {
        showDeleteConfirmDialog: false,
        allowEditing: false,
        allowDeleting: false,
      };
    this.grid.refresh(); */
    });
  }
  //#region CashReceipt Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.usergroupService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
  }
  //#endregion
  /* getAllUsers(){
    this.dashboardSer.getAllUsersInfo().subscribe(
      res=>{
        this.CashierList=[];
        this.CashierList = res as any;
        this.userGroupList=  Array<imp.UserGroupViewModel>();
        this.CashierList.forEach(item => {
          this.userGroupList.push(item);
        });


      },
    );
      } */
  //#region OperationMenu
  quickEvents(event: imp.quickAction): void {
    switch (event) {
      case imp.quickAction.afterNew:
        this.MyAfterNew();
        break;
      case imp.quickAction.beforeAdd:
        this.MyBeforAdd();
        break;
      case imp.quickAction.afterAdd:
        this.MyAfterAdd();
        break;
      case imp.quickAction.afterModify:
        this.MybeforModify();
        break;
      case imp.quickAction.afterUpdate:
        this.MyafterUpdate();
        break;
      case imp.quickAction.afterUndo:
        this.MyafterUndo();
        break;
      case imp.quickAction.beforeUpdate:
        this.MyBeforUpdate();
        break;
      /*     case imp.quickAction.afterDelete:
                            this.userGroupList.forEach(item => {
                              item.IsSelected=false;
                            });
                            this.grid.refresh();
                           break */
    }
  }
  //#endregion
  afterPag(data) {
    /*   this.userGroupList.forEach(item => {
      item.IsSelected=false;
   }); */
    this.responseobj = data;
    /* if( this.responseobj.Users != undefined && this.responseobj.Users != null){
  this.userGroupList.forEach(item => {
    this.responseobj.Users.forEach(item2 => {
        if(item.AppUserId==item2.AppUserId){
          item.IsSelected=true;
        }
      });
    });
}
else {
  this.userGroupList.forEach(item => {
    item.IsSelected=false;
  });
}
this.grid.refresh(); */
  }
  MyAfterNew() {
    /*   this.userGroupList.forEach(item => {
    item.IsSelected=false;
  });

this.editOptions = {
showDeleteConfirmDialog: true,
allowEditing: true,
allowDeleting: true,
};
this.MygridFlag=false;
this.grid.refresh(); */
  }

  MyBeforAdd() {
    this.responseobj.Users = [];
    /* this.userGroupList.forEach(item => {
     if(item.IsSelected==true){
     this.responseobj.Users.push(item);
     }
   });  */
  }
  MyBeforUpdate() {
    /*   this.responseobj.Users=[];
  this.userGroupList.forEach(item => {
    if(item.IsSelected==true){
    this.responseobj.Users.push(item);
    }
  }); */
  }
  MyAfterAdd() {
    /*  this.editOptions = {
    showDeleteConfirmDialog: false,
    allowEditing: false,
    allowDeleting: false,
  };
  this.MygridFlag=true;
this.grid.refresh(); */
  }
  MyafterUndo() {
    /*   this.editOptions = {
    showDeleteConfirmDialog: false,
    allowEditing: false,
    allowDeleting: false,
  };
  this.MygridFlag=true;
this.grid.refresh(); */
  }
  MybeforModify() {
    /*  this.editOptions = {
    showDeleteConfirmDialog: true,
    allowEditing: true,
    allowDeleting: true,
  };
  this.MygridFlag=false;
this.grid.refresh(); */
  }
  MyafterUpdate() {
    /*   this.editOptions = {
    showDeleteConfirmDialog: false,
    allowEditing: false,
    allowDeleting: false,
  };
  this.MygridFlag=true;
this.grid.refresh() */
  }
  /*   initializeGrid() {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = ["Search", "PdfExport", "ExcelExport"];
    this.editOptions = {
      showDeleteConfirmDialog: false,
      allowEditing: false,
      allowDeleting: false,
    };
    this.filterOptions = {
      type: 'Menu'
    };
  } */

  /*  public onRowSelected(args: imp.RowSelectEventArgs): void {
    if(this.MygridFlag==true){
    return ;
    }
    const queryData: any = args.data.valueOf();
    if (queryData.IsSelected == false) {
      this.userGroupList.forEach(item => {
        if (item.AppUserId == queryData.AppUserId) {
          item.IsSelected = true
        }

      });
      this.grid.refresh();
    }
    else {
      this.userGroupList.forEach(item => {
        if (item.AppUserId == queryData.AppUserId) {
          item.IsSelected = false;


        }

      });
      this.grid.refresh();
    }


  } */
  /*  ChangeSelectedUser(args: any){
    if(this.gridFlag==true){
      return
         }
         let currentRowObject: any = this.grid.getRowObjectFromUID(args.event.target.closest('tr').getAttribute('data-uid'));
         let currentRowData: Object = currentRowObject.data;
         this.userGroupList.forEach(item => {
          if(item.AppUserId==currentRowData["AppUserId"]){
            item.IsSelected=args.checked;
          }
})
  } */
}
