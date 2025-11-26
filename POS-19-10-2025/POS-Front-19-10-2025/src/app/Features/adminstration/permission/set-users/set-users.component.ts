import { Component, ViewChild } from "@angular/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../../permission-imports";
import { SettingService } from "../../permission-imports";
@Component({
  selector: "app-set-users",
  templateUrl: "./set-users.component.html",
  styleUrls: ["./set-users.component.scss"]
})
export class SetUsersComponent implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid") grid: imp.GridComponent;
  allSelected: boolean = false;
  indeterminate: boolean = false;
  userTypes: Array<{ key: any; total: number; selected: number }> = [];
  //#endregion
  constructor(
    public usergroupService: imp.UsergroupserviceService,
    public toastr: imp.ToastrService,
    public toastrMessage: imp.HandlingBackMessages,
    private router: imp.Router,
    public dashboardSer: imp.DashboardService,
    private languageSerService: LanguageSerService,
    public SettingSer: SettingService,
    private translate: imp.TranslateService
  ) {
    this.initializeobjects();
  }

  ngOnInit(): void {
    this.getAllUsers();
    this.initializeGrid();
    /*    this.responseobj.Name=this.request.Name;
    this.responseobj.DocumentId=this.request.DocumentId */
  }
    private updateSelectAllState(): void {
    const total = this.userGroupList?.length || 0;
    const selected = this.userGroupList?.filter((u: any) => u.IsSelected)?.length || 0;
    this.allSelected = total > 0 && selected === total;
    this.indeterminate = selected > 0 && selected < total;
    this.recomputeUserTypes();
  }
  onToggleSelectAll(args: any): void {
    const checked = !!args?.checked;
    if (this.userGroupList != null && Array.isArray(this.userGroupList)) {
      this.userGroupList?.forEach((item: any) => (item.IsSelected = checked));
    }
    this.updateSelectAllState();
    this.grid?.refresh();
  }
  private recomputeUserTypes(): void {
    const map = new Map<any, { total: number; selected: number }>();
    (this.userGroupList || []).forEach((u: any) => {
      const key = u?.UserType || 'Shared.Unassigned';
      const entry = map.get(key) || { total: 0, selected: 0 };
      entry.total += 1;
      if (u.IsSelected) entry.selected += 1;
      map.set(key, entry);
    });
    this.userTypes = Array.from(map.entries()).map(([key, v]) => ({ key, total: v.total, selected: v.selected }));
  }
  isGroupAllSelected(userType: any): boolean {
    const entry = (this.userTypes || []).find(x => x.key === userType);
    return !!entry && entry.total > 0 && entry.selected === entry.total;
  }
  isGroupIndeterminate(userType: any): boolean {
    const entry = (this.userTypes || []).find(x => x.key === userType);
    return !!entry && entry.selected > 0 && entry.selected < entry.total;
  }
  onToggleGroupSelect(userType: any, args: any): void {
    const checked = !!args?.checked;
    if (this.userGroupList != null && Array.isArray(this.userGroupList)) {
      this.userGroupList?.forEach((item: any) => {
        const key = item?.UserType || 'Shared.Unassigned';
        if (key === userType) {
          item.IsSelected = checked;
        }
      });
    }
    this.updateSelectAllState();
    this.grid?.refresh();
  }
  setUsersGroups(){
    this.usergroupService.getById(this.request.DocumentId).subscribe((res) => {
      this.responseobj = res;
      if (this.responseobj.Users != undefined && this.responseobj.Users != null) {
        this.userGroupList?.forEach((item) => {
          this.responseobj.Users.forEach((item2) => {
            if (item.AppUserId == item2.AppUserId) {
              item.IsSelected = true;
            }
          });
        });
      } else {
        this.userGroupList?.forEach((item) => {
          item.IsSelected = false;
        });
      }
      this.updateSelectAllState();
      this.grid?.refresh();
    });
  }
  //#region SetUsers Methods
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.usergroupService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.GetSettings();
  }
  getAllUsers() {
    this.dashboardSer.getActiveUsersInfo().subscribe((res) => {
      this.CashierList = [];
      this.CashierList = res as any;
      this.userGroupList = Array<imp.UserGroupViewModel>();
      this.CashierList.forEach((item) => {
        this.userGroupList.push(item);
      });
      this.setUsersGroups();
    });
  }
  initializeGrid() {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = ["Search", "PdfExport", "ExcelExport"];
    this.editOptions = {
      showDeleteConfirmDialog: false,
      allowEditing: false,
      allowDeleting: false
    };
    this.filterOptions = {
      type: "Menu"
    };
  }
  public ChangeUsersList(args: any): void {
    let currentRowObject: any = this.grid.getRowObjectFromUID(args.event.target.closest("tr").getAttribute("data-uid"));
    let currentRowData: Object = currentRowObject.data;
    this.userGroupList.forEach((item) => {
      if (item.AppUserId == currentRowData["AppUserId"]) {
        item.IsSelected = args.checked;
      }
    });
    this.updateSelectAllState();
    this.grid.refresh();
  }
  save() {
    this.responseobj.Users = [];
    this.userGroupList.forEach((item) => {
      if (item.IsSelected == true) {
        this.responseobj.Users.push(item);
      }
    });
    this.usergroupService.Transactions(this.responseobj, "Edit").subscribe((res) => {
      if (res == 2) {
        this.toastr.info(this.toastrMessage.GlobalMessages(res));
        this.router.navigateByUrl("/PermissionGroup");
      } else {
        this.toastr.error(this.toastrMessage.GlobalMessages(res));
      }
    });
  }
  undo() {
    /*   this.usergroupService.firstOpen(this.request.DocumentId).subscribe(
      res => {
        this.responseobj = res as any;
        this.responseobj.POSScreenPermissions as ScreenPermissions[];
        this.responseobj.GroupId=this.request.DocumentId;
        this.Getdata();


      }

      ); */
  }
  GetSettings() {
    this.SettingSer.GetSettings().subscribe((res) => {
      this.settings = res as any;
    });
  }
  get disableEditPermission(){
    return !this.settings || (this.settings && this.settings.PullAllTablesFromPOS);
  }
  //#endregion
}
