import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { CategoryService, general, LanguageSerService, quickAction } from "../category-imports";

@Component({
  selector: "app-category",
  templateUrl: "./category.component.html",
  styleUrls: ["./category.component.scss"]
})
export class CategoryComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  //#endregion

  constructor(
    public _CategoryService: CategoryService,
    public languageSerService: LanguageSerService,
    public translate: TranslateService,
    public router: Router
  ) {
    super();
    this.initializeobjects();
  }

  ngOnInit() {
    this.scrFirstOpen().subscribe((res) => {
      this.responseobj.screenPermission.Print = false;
    });
  }
  //#region OperationMenu
  quickEvents(event: quickAction): void {
    switch (event) {
      case quickAction.afterNew:
        this.afterNew({});
        break;
      case quickAction.beforeAdd:

        break;
      case quickAction.afterAdd:
        this.afterAdd();
        break;
    }
  }
  //#endregion
  //#region Pagger
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  //#endregion

  initializeobjects(): void {
    this.responseobj = {};
    this.service = this._CategoryService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
}
