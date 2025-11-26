import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../print-imports";
@Component({
  selector: "app-product-printing",
  templateUrl: "./product-printing.component.html",
  styleUrls: ["./product-printing.component.scss"]
})
export class ProductPrintingComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  Reporfield = { text: "Name", value: "Name" };
  Field = { text: "Name", value: "DocumentId" };
  //#endregion
  constructor(
    public PrintSer: imp.PrinterService,
    public router: imp.Router,
    public route: imp.ActivatedRoute,
    public toastr: imp.ToastrService,
    public toastrMessage: imp.HandlingBackMessages,
    private languageSerService: LanguageSerService,
    public translate: TranslateService
  ) {
    super();
    this.initializeobjects();
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.PrintSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }
  ngOnInit(): void {
    if (
      this.request.DocumentId != undefined &&
      (this.request.DocumentId != undefined) != null &&
      this.request.DocumentId != ""
    ) {
      this.PrintSer.GetPrinterdata(this.request.DocumentId).subscribe((res) => {
        this.data = res;
        if (this.data == "null" || this.data == undefined) {
          this.router.navigateByUrl("/login");
        }
        this.PrinterProductGroups = [];
        this.PrinterProducts = [];
        this.ReportNameList = [];
        this.OrderTypeList = [];
        this.PrinterList = [];
        this.PrinterOrderTypes = [];
        this.PrinterProductGroups = this.data.PrinterProductGroups;
        this.PrinterProducts = this.data.PrinterProducts;
        this.ReportNameList = this.data.ReportNameList;
        this.OrderTypeList = this.data.OrderTypeList;
        this.PrinterList = this.data.PrinterList;
        this.PrinterOrderTypes = this.data.PrinterOrderTypes;
      });
    } else {
      this.router.navigate(["/printer/printerlist"]);
      this.toastr.error("Should Choose aPrinter  First", "Printer List");
    }
  }
  CheckAllProductGroups(event) {
    let result = event.target.checked;
    this.PrinterProductGroups.forEach((item) => {
      item.IsSelected = result;
    });
    this.PrinterProducts.forEach((item) => {
      item.IsSelected = result;
    });
  }

  SelectProductGroup(data: any, event) {
    let result = event.target.checked;
    let x = this.PrinterProducts.filter((x) => x.ProductGroupDocumentId == data.ProductGroupDocumentId);
    this.PrinterProducts.forEach((item) => {
      if (item.ProductGroupDocumentId == data.ProductGroupDocumentId) {
        item.IsSelected = result;
      }
    });
  }
  getProductsInGroup(ProductGroupDocumentId): any {
    let newproducts = this.cloneList(this.PrinterProducts);
    newproducts = newproducts.filter((x) => x.ProductGroupDocumentId == ProductGroupDocumentId);
    return newproducts;
  }
  changeSelectedProduct(data: any, event) {
    let result = event.target.checked;
    this.PrinterProducts.forEach((item) => {
      if (item.ProductDocumentId == data.ProductDocumentId) {
        item.IsSelected = result;
      }
    });
  }

  SaveProducts() {
    this.responseobj.DocumentId = this.request.DocumentId;
    this.responseobj.Name = this.request.Name;
    this.responseobj.IsChief = this.request.IsChief;
    this.responseobj.ChiefPassword = this.request.ChiefPassword;
    this.responseobj.PrintNewProductsOnlyInBundeled = this.request.PrintNewProductsOnlyInBundeled;
    this.responseobj.VirtualName = this.request.VirtualName;
    this.responseobj.PrintProductSeparately = this.request.PrintProductSeparately;
    this.responseobj.BranchId = this.request.BranchId;
    this.responseobj.BranchDocumentId = this.request.BranchDocumentId;
    this.responseobj.KDSOrderTypeList = this.request.KDSOrderTypeList;

    this.responseobj.PrinterOrderTypes = [];
    this.responseobj.PrinterProducts = [];
    this.responseobj.PrinterProductGroups = [];

    this.PrinterOrderTypes.forEach((item) => {
      if (item.IsSelected == true) {
        item.PrinterId = this.request.DocumentId;
        this.responseobj.PrinterOrderTypes.push(item);
      }
    });
    this.PrinterProducts.forEach((item) => {
      if (item.IsSelected == true) {
        item.PrinterId = this.request.DocumentId;
        this.responseobj.PrinterProducts.push(item);
      }
    });
    this.PrinterProductGroups.forEach((item) => {
      if (item.IsSelected == true) {
        item.PrinterId = this.request.DocumentId;
        this.responseobj.PrinterProductGroups.push(item);
      }
    });
    this.PrintSer.Transactions(this.responseobj, "Edit").subscribe((res) => {
      if (res == 2) {
        this.toastr.success(this.toastrMessage.GlobalMessages(res));
        this.router.navigate(["/printer/printerlist"]);
      } else {
        this.toastr.error(this.toastrMessage.GlobalMessages(res), this._pagename);
      }
    });
  }
}
