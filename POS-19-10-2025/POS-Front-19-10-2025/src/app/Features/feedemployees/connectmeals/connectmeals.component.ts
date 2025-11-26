import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../feedemployees-imports";
@Component({
  selector: "app-connectmeals",
  templateUrl: "./connectmeals.component.html",
  styleUrls: ["./connectmeals.component.scss"]
})
export class ConnectmealsComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  public customClass: string = "customClass";
  public isOpenFirst: boolean = true;
  options: number[] = [10, 15, 20, 50];
  finalProductList: any[] = [];
  filteredProductList: any[] = [];
  pagedProductList: any[] = [];
  NumberItems: number = 10;
  currentPage = 1;
  smallnumPages = 1;
  maxPagesToShow = 0; // Maximum number of page buttons to show in pagination
  searchTerm: string = '';
  //#endregion

  // Make Math available in template
  public Math = Math;

  //#region Pagination Methods
  setPage(page: number): void {
    if (page < 1 || page > this.smallnumPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagedProducts();
  }

  getPages(): number[] {
    const pages: number[] = [];
    let startPage = 1;
    let endPage = this.smallnumPages;
    
    if (this.smallnumPages > this.maxPagesToShow) {
      const maxPagesBeforeCurrent = Math.floor(this.maxPagesToShow / 2);
      const maxPagesAfterCurrent = Math.ceil(this.maxPagesToShow / 2) - 1;
      
      if (this.currentPage <= maxPagesBeforeCurrent) {
        // Near the start
        endPage = this.maxPagesToShow;
      } else if (this.currentPage + maxPagesAfterCurrent >= this.smallnumPages) {
        // Near the end
        startPage = this.smallnumPages - this.maxPagesToShow + 1;
      } else {
        // In the middle
        startPage = this.currentPage - maxPagesBeforeCurrent;
        endPage = this.currentPage + maxPagesAfterCurrent;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  updatePagedProducts(): void {
    const startIndex = (this.currentPage - 1) * this.NumberItems;
    const endIndex = Math.min(startIndex + this.NumberItems, this.filteredProductList?.length || 0);
    this.pagedProductList = this.filteredProductList?.slice(startIndex, endIndex) || [];
  }

  onChangeSelection(itemsPerPage: number | any): void {
    if (typeof itemsPerPage === 'object' && itemsPerPage?.target) {
      // Handle event object case
      this.NumberItems = Number(itemsPerPage.target?.value || 10);
    } else {
      // Handle direct number case
      this.NumberItems = Number(itemsPerPage);
    }
    this.currentPage = 1;
    this.updatePagination();
  }

  updatePagination(): void {
    // Apply search filter
    this.applySearchFilter();
    
    if (this.filteredProductList?.length > 0) {
      this.smallnumPages = Math.ceil(this.filteredProductList.length / this.NumberItems);
      if (this.currentPage > this.smallnumPages) {
        this.currentPage = this.smallnumPages || 1;
      }
      this.updatePagedProducts();
    } else {
      this.smallnumPages = 1;
      this.currentPage = 1;
      this.pagedProductList = [];
    }
  }

  applySearchFilter(): void {
    if (!this.searchTerm.trim()) {
      this.filteredProductList = [...this.finalProductList];
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase().trim();
    this.filteredProductList = this.finalProductList.filter(product => 
      product.ProductName?.toLowerCase().includes(searchTermLower)
    );
  }

  onSearchChange(): void {
    this.currentPage = 1; // Reset to first page when search changes
    this.updatePagination();
  }
  //#endregion

  //#region Constructor
  constructor(
    public foodplanservice: imp.FoodPlanService,
    public router: imp.Router,
    public toastr: imp.ToastrService,
    private route: imp.ActivatedRoute,
    public toastrMessage: imp.HandlingBackMessages,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    super();
    this.initializeobjects();
  }
  //#endregion

  ngOnInit(): void {
    if (
      this.request.DocumentId != undefined &&
      (this.request.DocumentId != undefined) != null &&
      this.request.DocumentId != ""
    ) {
      this.foodplanservice.GetproductFoodPlan(this.request.DocumentId).subscribe((res) => {
        this.data = res;
        if (res == null || res == undefined) {
          this.router.navigate(["/Feedemployees/FeedemployeesList"]);
          this.toastr.error("No Products", " Food Plane");
        }
        this.FoodPlanProductModelList = [];
        this.FoodPlanProductModelList = this.data.FoodPlanProductModelList;
        this.finalProductList = [...this.FoodPlanProductModelList];
        this.filteredProductList = [...this.finalProductList];
        this.maxPagesToShow = this.finalProductList?.length;
        this.updatePagination();
        this.pagainateProducts();
      });
    } else {
      this.router.navigate(["/Feedemployees/FeedemployeesList"]);
      this.toastr.error("Should Choose aPlane First", " Food Plane");
    }
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.foodplanservice;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  SaveProducts() {
    this.responseobj.DocumentId = this.request.DocumentId;
    this.responseobj.Name = this.request.Name;
    this.responseobj.ForiegnName = this.request.ForiegnName;
    this.responseobj.AmountMeals = this.request.AmountMeals;
    this.responseobj.Count = this.request.Count;
    this.responseobj.CountMeals = this.request.CountMeals;
    this.responseobj.CountProducts = this.request.CountProducts;
    this.responseobj.FoodPlanEmployees = this.request.FoodPlanEmployees;
    this.responseobj.POSFoodPlanProducts = [];
    this.data.FoodPlanProductModelList.forEach((item) => {
      if (item.IsSelected == true) {
        this.responseobj.POSFoodPlanProducts.push(item);
      }
    });
    this.foodplanservice.Transactions(this.responseobj, "Edit").subscribe((res) => {
      if (res == 2) {
        this.toastr.info(this.toastrMessage.GlobalMessages(res));
        this.router.navigate(["/Feedemployees/FeedemployeesList"]);
      } else {
        this.toastr.error(this.toastrMessage.GlobalMessages(res), this._pagename);
      }
    });
  }
  pageChanged(event: imp.PageChangedEvent): void {
    this.currentPage = event.page;
    this.updatePagedProducts();
  }

  pagainateProducts() {
    this.updatePagination();
  }
  selectedProduct(data) {
    this.data.FoodPlanProductModelList.forEach((item) => {
      if (data.ProductDocumentId == item.ProductDocumentId) {
        item.IsSelected = data.IsSelected;
      }
    });
  }
}
