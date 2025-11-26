import { Component, ViewChild, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { BranchService } from "../../branch/branchimport";
import { general, StopProductsService, LanguageSerService, HandlingBackMessages } from "../stop-product-imports";

@Component({
  selector: "app-stop-products",
  templateUrl: "./stop-products.component.html",
  styleUrls: ["./stop-products.component.scss"]
})
export class StopProductsComponent extends general implements OnInit {
  constructor(
    public _StopProductService: StopProductsService,
    public _branchService: BranchService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private router: Router,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages
  ) {
    super();
    this.initializeobjects();
  }
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  public Fld = { text: "Name", value: "DocumentId" };

  //#endregion
  ngOnInit(): void {
    this.GetDate();
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this._StopProductService;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  GetDate() {
    this.requestStarted = true;
    this._StopProductService.GetStopDurationList().subscribe((data) => {
      this.StopDurationList = data;
      this.StopDurationList = this.StopDurationList.map((val) => {
        return {
          Name: this.translate.instant("setting." + val.Name),
          Id: val.Id
        };
      });
      this.Flds = { text: "Name", value: "Id" };
    });
    this._StopProductService.FirstOpen().subscribe((data) => {
      this.requestStarted = false;
      this.Products = data;
    });
    this.getBranches();
  }
  getBranches(){
    this._branchService.getLookUp().subscribe(res=>{
      this.branches = res
    })
  }
  Save() {
    this.submitted = true;
    if(!this.selectedBranches || !this.selectedBranches.length)
      return;

    let list = [];
    this.Products.forEach((item) => {
      if (item.IsSelected) {
        item.BranchesList = this.selectedBranches;
        list.push(item);
      }
    });
    this._StopProductService.UpdateproductProperties(list).subscribe((res) => {
      if (res == 2) {
        this.toastr.info(this.toastrMessage.GlobalMessages(res));
        this.GetDate();
        this.selectedBranches = [];
        this.submitted = false;
      }
    });
  }
  getProperityBranches(product){
    if(product.BranchesList?.length && this.branches?.length ){
      const branchNames = this.branches.filter(b=> product.BranchesList.includes(b.DocumentId)).map(b=>b.Name);
      return branchNames.join(", ");
    }
    else
      return '';
  }
}
