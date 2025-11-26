import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { MyPointsService } from "src/app/core/Services/Transactions/my-points.service";
import { general, LanguageSerService, quickAction, ToastrService } from "../../adminstration/permission-imports";
import { MyPointModel } from "src/app/core/Models/order/MyPoint.Model";
import { MyPointDetailModel } from "src/app/core/Models/order/MyPointDetail.Model";
import { PageChangedEvent } from "ngx-bootstrap/pagination";
declare let $: any;

@Component({
  selector: "app-my-points",
  templateUrl: "./my-points.component.html",
  styleUrls: ["./my-points.component.scss"]
})
export class MyPointsComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  public Flds = { text: "Name", value: "Id" };
  public FldDocumentId = { text: "Name", value: "DocumentId" };
  public newTableList: any = [];
  public newProductList: any = [];
  // taxobj = {};
  ifUseTaxatt: boolean = false;
  editDefault: boolean = false;
  MyPoint: MyPointModel = new MyPointModel();
  MyPointDetails: MyPointDetailModel[] = [];
  MyPointDetail: MyPointDetailModel = new MyPointDetailModel();
  itemsPerPageOptions: number[] = [15, 20]; // Choose your desired options
  itemsPerPage: number = this.itemsPerPageOptions[0]; // Default items per page
  currentPage: number = 1;
  //#endregion
  constructor(
    public MyPointsSer: MyPointsService,
    private Router: ActivatedRoute,
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public toastr: ToastrService,
    private router: Router
  ) {
    super();

    this.initializeobjects();
  }

  ngOnInit() {
    this.myPointsFirstOpen();
  }
  myPointsFirstOpen() {
    this.MyPointsSer.myPointsFirstOpenAsync().subscribe((res: any) => {
      // this.AllPayTypes = res.AllPayTypes;
      this.MyPoint = res.MyPoint as MyPointModel;
      this.MyPointDetails = this.MyPoint.MyPointDetails;
      this.products = res.Products ?? [];
      const selecteproducts = res.MyPoint.ProductDocumentIds ?? [];
      this.newProductList = (this.products ?? []).map(product => ({
        ...product,
        IsChecked: selecteproducts.includes(product.DocumentId) // true if id exists
      }));
    
      this.firstOpen();
    });
  }
  firstOpen() {
    this.scrFirstOpen().subscribe(() => {
      // this.responseobj.ValueTypesEnum = [
      //   { Id: 1, Name: this.translate.instant("Shared.Percentage") },
      //   { Id: 2, Name: this.translate.instant("Shared.value") }
      // ];

      // this.responseobj.PayTypesEnum = [
      //   { Id: 10, Name: this.translate.instant("Shared.Cash") },
      //   { Id: 20, Name: this.translate.instant("Shared.Credit") },
      //   { Id: 30, Name: this.translate.instant("Shared.Visa") }
      // ];

      if (this.request.currentAction == "Add") {
        // this.responseobj.TimeFrom = null;
        // this.responseobj.TimeTo = null;
      }
      if (this.request.currentAction == "Edit") {
        this.disabledflag = true;
      }
      this.disableAdd();
    });
  }

  disableAdd() {
    this.responseobj.screenPermission.New = false;
    this.responseobj.screenPermission.Print = false;
    this.responseobj.screenPermission.Delete = false;
  }
  //#region OperationMenu
  quickEvents(event: quickAction): void {
    this.ProductDocumentIds = this.newProductList.filter(x=> x.IsChecked).map(x=> x.DocumentId);
    this.responseobj.ProductDocumentIds = this.ProductDocumentIds;
    this.responseobj.screenPermission.Print = false;
    switch (event) {
      case quickAction.afterNew:
        break;
      case quickAction.beforeAdd:

        if(this.responseobj.MyPointDetails.length == 0){
          this.toastr.warning(this.translate.instant("messages.YoushouldatleastaddonePointsCard"));
          this.frmRef.form.setErrors({ 'invalid':true});
        }
        break;
      case quickAction.afterAdd:
        this.disabledflag = false;
        break;
      case quickAction.afterUpdate:
        this.disabledflag = false;
        this.disableAdd();
        break;
      case quickAction.beforeUpdate:
        this.responseobj.MyPointDetails = this.MyPointDetails ;
        if(this.responseobj.MyPointDetails.length == 0){
          this.toastr.warning(this.translate.instant("messages.YoushouldatleastaddonePointsCard"));
          this.frmRef.form.setErrors({ invalid:true });
          break;
        }
        break;
      case quickAction.afterModify:
        this.disabledflag = true;
        this.disableAdd();
        break;
      case quickAction.afterUndo:
        this.disabledflag = false;
        break;
      case quickAction.afterDelete:
        this.disabledflag = false;
        break;
    }
  }

  //#endregion
  //#region Pagger

  initializeobjects(): void {
    this.responseobj = {};
    this.data = {};
    this.service = this.MyPointsSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  //#region Pagger
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
  }
  //#endregion
  addDetail(data: any) {
    this.MyPointDetail = new MyPointDetailModel();
    this.MyPointDetail.PointsCount = data.PointsCount;
    this.MyPointDetail.Value = data.Value;
    this.MyPointDetails.push(this.MyPointDetail);
    $("#DetailsMyPoint").modal("hide");
  }
  OpenMyPointPOPUp() {
    this.data = {};
    this.MyPointDetail = new MyPointDetailModel();
    $("#DetailsMyPoint").modal("show");
  }
  EditRow(item,i) {
    this.data = {};
    this.editDefault = true;
    this.MyPointDetail = item;
    this.data.PointsCount = item.PointsCount;
    this.data.Value = item.Value;
    $("#DetailsMyPoint").modal("show");
  }
  editDetail(data: any) {
    this.MyPointDetail.IsDefault = this.MyPointDetail.IsDefault;
    this.MyPointDetail.PointsCount = data.PointsCount;
    this.MyPointDetail.Value = data.Value;
    this.MyPointDetails.splice(this.MyPointDetails.indexOf(this.MyPointDetail), 1);
    this.MyPointDetails.push(this.MyPointDetail);
    this.editDefault = false;
    $("#DetailsMyPoint").modal("hide");
  }

  RemoveRow(i) {
    this.MyPointDetails.splice(i, 1);
  }

  setCurrentPage(): void {
    this.pC = { page: 1, itemsPerPage: !this.itemsPerPage ? 15 : this.itemsPerPage };
    this.pageChanged(this.pC);
  }
  get paginatedData(): any[] {
    if (this._paginatedData) {
      return this._paginatedData;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.newTableList = this.newProductList.sort((a, b) => Number(b.IsChecked) - Number(a.IsChecked)).slice(startIndex, endIndex);
    return this.newTableList; 
  }

  pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    const startItem = (event.page - 1) * event.itemsPerPage;
    const endItem = event.page * event.itemsPerPage;
    this._paginatedData = this.newProductList.slice(startItem, endItem);
  }

  SelectAllEvent(event: any) {
    let value = event.currentTarget.checked;
    this.newProductList.forEach((item) => {
      item.IsChecked = value;
    });
  }
  
  searchProducts(ProductValue) {
    if (!ProductValue) {
      this.newProductList = [];
      this.newProductList = this.products ?? [];
    } else if (ProductValue && ProductValue != "") {
      this.newProductList = [];
      this.newProductList = this.products.filter(
        (item) =>
          item.Name.toLowerCase().indexOf(ProductValue.toLowerCase()) > -1
      ) ?? [];
    }  else if (ProductValue && ProductValue != "") {
      this.newProductList = [];
      this.newProductList = this.products.filter(
        (item) => item.Name.toLowerCase().indexOf(ProductValue.toLowerCase()) > -1
      ) ?? [];
    }
  }
}
