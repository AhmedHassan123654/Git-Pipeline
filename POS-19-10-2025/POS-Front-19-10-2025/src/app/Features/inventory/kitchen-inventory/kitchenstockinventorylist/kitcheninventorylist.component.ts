import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import Swal from "sweetalert2";
import * as imp from "../kitcheninventory-imports";
@Component({
  selector: "app-inventorylist",
  templateUrl: "./kitcheninventorylist.component.html",
  styleUrls: ["./kitcheninventorylist.component.scss"]
})
export class KitchenInventorylistComponent extends imp.GenericGridList implements imp.OnInit {
  [key: string]: any;
  @ViewChild("grid", { static: false }) grid: imp.GridComponent;
  constructor(
    private kitcheninventoryService: imp.KitchenInventoryService,
    public toster: imp.ToastrService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    public shared: imp.ISharedGridList,
    public messages: imp.HandlingBackMessages,
    public router: imp.Router,
    public SettingSer: imp.SettingService
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
    super.setServiceAndRouteName(this.kitcheninventoryService, "/kitcheninventory");
  }
}
