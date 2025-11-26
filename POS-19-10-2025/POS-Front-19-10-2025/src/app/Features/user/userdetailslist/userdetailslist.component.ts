import * as imp from "../userimport";
import { Component, ViewChild } from "@angular/core";
import Keyboard from "simple-keyboard";
import Swal from "sweetalert2";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-userdetailslist",
  templateUrl: "./userdetailslist.component.html",
  styleUrls: ["./userdetailslist.component.css"]
})
export class UserdetailslistComponent extends imp.GeneralGrid implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  //#endregion

  @ViewChild("grid") grid: imp.GridComponent;
  constructor(
    public userDetailsSer: imp.UserDetailsService,
    public toast: imp.ToastrService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public messages: imp.HandlingBackMessages,
    public SettingSer: imp.SettingService,
    public Rout: imp.Router
  ) {
    super(toast, messages, SettingSer, Rout);
    this.initializeobjects();
  }
  ngOnInit() {
    this.GetGrideList().subscribe(() => {
      this.toolbarList = [];
      if (this.showNew)
        this.toolbarList.push({
          text: "",
          tooltipText: "Add",
          prefixIcon: "e-add",
          id: "Add"
        });
      if (this.showView)
        this.toolbarList.push({
          text: "",
          tooltipText: "View",
          prefixIcon: "e-view",
          id: "View"
        });
      if (this.showEdit)
        this.toolbarList.push({
          text: "",
          tooltipText: "Edit",
          prefixIcon: "e-edit",
          id: "Edit"
        });
      if (this.showDelete)
        this.toolbarList.push({
          text: "",
          tooltipText: "Delete",
          prefixIcon: "e-delete",
          id: "Delete"
        });
      /*  if(this.showPrint)
          this.toolbarList.push({ text: '', tooltipText: 'Print', prefixIcon: 'e-print', id: "Print" }); */
      this.toolbarOptions = this.toolbarList;
    });
    this.initializeGrid();
    setTimeout(() => {
      this.DisabledGridButton();
    }, 300);
  }
  //#region User Methods
  initializeobjects(): void {
    this.responseobj = [];
    this.service = this.userDetailsSer;
    this.showEdit = false;
    this.showDelete = false;
    this.showNew = false;
    this.showView = false;
    this.showPrint = false;
    this.RouteName = "/user";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  //#endregion
}
