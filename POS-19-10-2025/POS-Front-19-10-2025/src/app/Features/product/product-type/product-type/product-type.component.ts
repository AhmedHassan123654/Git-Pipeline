import { Component, OnInit, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../productTypeimports";
@Component({
  selector: "app-product-type",
  templateUrl: "./product-type.component.html",
  styleUrls: ["./product-type.component.scss"]
})
export class ProductTypeComponent extends imp.general implements imp.OnInit {
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  constructor(
    public productTypeSer: imp.ProductTypeService,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    private router: imp.Router
  ) {
    super();
    this.initializeobjects();
  }
  ngOnInit(): void {
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Print = false;
    });
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.productTypeSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  quickEvents(event: imp.quickAction): void {
    if (this.responseobj.screenPermission) this.responseobj.screenPermission.Print = false;
    switch (event) {
      case imp.quickAction.afterNew:
        this.afterNew({});
        break;
      case imp.quickAction.afterAdd:
        this.afterAdd();
        break;
      case imp.quickAction.afterModify:
        this.afterModify();
        break;
      case imp.quickAction.beforeAdd:
        if (
          this.responseobj != undefined &&
          (this.responseobj.IsStopped == null || this.responseobj.IsStopped == undefined)
        ) {
          this.responseobj.IsStopped = false;
        }
        if (
          this.responseobj != undefined &&
          (this.responseobj.HideProductGroupsInOrder == null || this.responseobj.HideProductGroupsInOrder == undefined)
        ) {
          this.responseobj.HideProductGroupsInOrder = false;
        }
        break;
    }
  }
}
