import { Component, OnInit, ViewChild } from "@angular/core";
import * as imp from "../stockadjustment-imports";
import Swal from "sweetalert2";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
@Component({
  selector: "app-kitchenadjutmentlist",
  templateUrl: "./kitchenadjutmentlist.component.html",
  styleUrls: ["./kitchenadjutmentlist.component.scss"]
})
export class KitchenadjutmentlistComponent extends imp.GenericGridList implements imp.OnInit {
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: imp.GridComponent;

  constructor(
    public kitchenadjutmentService: imp.KitchenadjustmentService,
    public shared: imp.ISharedGridList,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    super(shared);
    this.initializeobjects();
  }
  ngOnInit(): void {
    super.getGrideList().subscribe(() => {});
    super.initializeGrid();
  }
  initializeobjects(): void {
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    super.setServiceAndRouteName(this.kitchenadjutmentService, "/KitchenAdjustment");
    super.showActionButton("Edit", false);
    super.showActionButton("Delete", false);
  }
}
