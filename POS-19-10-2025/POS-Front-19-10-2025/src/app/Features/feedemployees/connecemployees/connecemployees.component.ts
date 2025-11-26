import { Component, ViewChild } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import * as imp from "../feedemployees-imports";
import { PageChangedEvent } from "../feedemployees-imports";

@Component({
  selector: "app-connecemployees",
  templateUrl: "./connecemployees.component.html",
  styleUrls: ["./connecemployees.component.scss"]
})
export class ConnecemployeesComponent extends imp.general implements imp.OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  public customClass: string = "customClass";
  public isOpenFirst: boolean = true;
  options: number[] = [10, 15, 20, 50];
  finalProductList: any[] = [];
  pagedEmployeeList: any[] = [];
  NumberItems: number = 10;
  currentPage = 1;
  smallnumPages = 1;
  maxPagesToShow = 0; // Maximum number of page buttons to show in pagination
  public Math = Math;
  //#endregion

  //#region Pagination Methods
  setPage(page: number): void {
    if (page < 1 || page > this.smallnumPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagedEmployees();
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

  updatePagedEmployees(): void {
    const startIndex = (this.currentPage - 1) * this.NumberItems;
    const endIndex = Math.min(startIndex + this.NumberItems, this.finalProductList?.length || 0);
    this.pagedEmployeeList = this.finalProductList?.slice(startIndex, endIndex) || [];
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
    if (this.finalProductList?.length > 0) {
      this.smallnumPages = Math.ceil(this.finalProductList.length / this.NumberItems);
      if (this.currentPage > this.smallnumPages) {
        this.currentPage = this.smallnumPages || 1;
      }
      this.updatePagedEmployees();
    } else {
      this.smallnumPages = 1;
      this.currentPage = 1;
      this.pagedEmployeeList = [];
    }
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
      this.foodplanservice.GetemployeeFoodPlan(this.request.DocumentId).subscribe((res) => {
        this.data = res;
        if (res == null || res == undefined) {
          this.router.navigate(["/Feedemployees/FeedemployeesList"]);
          this.toastr.error("No Products", " Food Plane");
        }
        this.FoodPlanEmployeeModelList = [];
        this.FoodPlanEmployeeModelList = this.data.FoodPlanEmployeeModelList;
        this.finalProductList = [...this.FoodPlanEmployeeModelList];
        this.maxPagesToShow = this.finalProductList?.length;
        this.updatePagination();
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
    this.responseobj.POSFoodPlanProducts = this.request.POSFoodPlanProducts;
    this.responseobj.FoodPlanEmployees = [];
    this.data.FoodPlanEmployeeModelList.forEach((item) => {
      if (item.IsSelected == true) {
        this.responseobj.FoodPlanEmployees.push(item);
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

  pageChanged(event: PageChangedEvent): void {
    this.currentPage = event.page;
    this.updatePagedEmployees();
  }

  pagainateProducts() {
    this.updatePagination();
  }
  selectedEmp(data) {
    this.data.FoodPlanEmployeeModelList.forEach((item) => {
      if (data.EmployeeDocumentId == item.EmployeeDocumentId) {
        item.IsSelected = data.IsSelected;
      }
    });
  }
}
