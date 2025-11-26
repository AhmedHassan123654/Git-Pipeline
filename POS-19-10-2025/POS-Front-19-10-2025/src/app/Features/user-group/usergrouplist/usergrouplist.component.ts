import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import Swal from "sweetalert2";
import * as imp from "../userimports";
@Component({
  selector: "app-usergrouplist",
  templateUrl: "./usergrouplist.component.html",
  styleUrls: ["./usergrouplist.component.css"]
})
export class UsergrouplistComponent extends imp.GeneralGrid implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: imp.GridComponent;
  //#endregion
  //#region Constructor
  constructor(
    public Usergroupservice: imp.UsergroupserviceService,
    public toast: imp.ToastrService,
    public messages: imp.HandlingBackMessages,
    public SettingSer: imp.SettingService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public Rout: imp.Router
  ) {
    super(toast, messages, SettingSer, Rout);
    this.initializeobjects();
  }
  //#endregion
  ngOnInit(): void {
    this.GetGrideList();
    this.initializeGrid();
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.Usergroupservice;
    this.showEdit = false;
    this.showDelete = false;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  onResourceEdit(event: any): void {
    const rowData = this.grid.getRowInfo(event.target).rowData as unknown;
    this.router.navigateByUrl("/UserGroup", rowData);
  }
  /*    onResourceDelete(event:any):void{

      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'error',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it?'
      }).then((result) => {
        if (result.isConfirmed) {
           const rowData =this.grid.getRowInfo(event.target).rowData as unknown;
           this.deleteFromGrideList(rowData);



         }
      });

    } */
}
