import { Component, Input, OnInit, Output, ViewChild } from "@angular/core";
import { SaleReportModel } from "src/app/core/Models/Reporting/sale-report-model";
import { SalesReportService } from "src/app/core/Services/Reporting/sales-report.service";
import { DashboardService } from "src/app/core/Services/Transactions/dashboard.service";
import {
  ClickEventArgs,
  HandlingBackMessages,
  Router,
  SettingService,
  ToastrService
} from "src/app/shared/Imports/featureimports";
import {
  GridModel,
  GridComponent,
  DetailRowService,
  ExcelExportService,
  ToolbarService
} from "@syncfusion/ej2-angular-grids";
import { FollowOrdersService } from "src/app/core/Services/order/follow-orders.service";
import * as en from "src/assets/i18n/en.json";
import * as ar from "src/assets/i18n/ar.json";
import * as tr from "src/assets/i18n/tu.json";
import * as fr from "src/assets/i18n/fr.json";
import * as localForage from "localforage";
import { SettingModel } from "src/app/core/Models/Transactions/setting-model";
import { formatDate } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { ExtraExpensesService } from "../../extra-expenses/extraexpensis";
import { EventEmitter } from "@angular/core";
import { CustomerOrderService } from "../../customer-order/customerorderimport";
import { ProductService } from "../../product/product/productimports";
import { CustomerModel } from "../../customer/customerimport";
import { OrderService } from "../../follow-call-center-order/follow-call-center-order-imports";
import { ProductGroupService } from "../../product-group/product-groupimports";
import { ProductTypeService } from "../../product/product-type/productTypeimports";
import { EmployeeService } from "src/app/core/Services/Transactions/employee.service";
import { deepCopy, getOnlyDateFromString, getOnlyDateString } from "src/app/core/Helper/objectHelper";
interface ITab {
  title: string;
  content: any;
  removable: boolean;
  disabled: boolean;
  active?: boolean;
  customClass?: string;
}
declare let $: any;
declare var Stimulsoft: any;
@Component({
  selector: "app-pos-report",
  templateUrl: "./pos-report.component.html",
  styleUrls: ["./pos-report.component.scss"],
  providers: [DetailRowService, ExcelExportService, ToolbarService]
})
export class PosReportComponent implements OnInit {
  //#region Declartions
  [key: string]: any;
  tabs: ITab[] = [];
  responseobj: SaleReportModel = new SaleReportModel();
  public languages: any[] = [
    { Id: 1, Name: "English" },
    { Id: 2, Name: "Arabic" },
    { Id: 3, Name: "Turkish" },
    { Id: 4, Name: "French" }
  ];
  public printModels: any[] = [];
  public destinations: any[] = [
    { Id: 1, Name: "Preview" },
    { Id: 2, Name: "Email" }
  ];
  public fileFormats: any[] = [{ Id: 1, Name: "PDF" }];
  public UseTax: boolean = false;
  public printflag: number;
  public child: GridModel;
  public child1: GridModel;
  public TransferdChild: GridModel;
  public childCustomer: GridModel;
  public captainChildGrid: GridModel;
  public CustomerOrders1ChildGrid: GridModel;
  options: any = new Stimulsoft.Viewer.StiViewerOptions();
  viewer: any = new Stimulsoft.Viewer.StiViewer(this.options, "StiViewer", false);
  report: any = new Stimulsoft.Report.StiReport();
  @ViewChild("Order") OrdersGrid: GridComponent;
  @ViewChild("Product") ProductGrid: GridComponent;
  @ViewChild("ProductGroupChild") ProductGroupGrid: GridComponent;
  @ViewChild("ProductGroupChild1") ProductGroupGrid1: GridComponent;
  @ViewChild("Date") DateGrid: GridComponent;
  @ViewChild("Tips") TipsGrid: GridComponent;
  @ViewChild("OrderType") OrderTypeGrid: GridComponent;
  @ViewChild("OrderPayType") OrderPayTypeGrid: GridComponent;
  @ViewChild("CaptainGrid") CaptainGrid: GridComponent;
  @ViewChild("CaptainGrid1") CaptainGrid1: GridComponent;
  @ViewChild("Hall") HallGrid: GridComponent;
  @ViewChild("User") UserGrid: GridComponent;
  @ViewChild("ProductType") ProductTypeGrid: GridComponent;
  @ViewChild("Customer") CustomerGrid: GridComponent;
  @ViewChild("NetSales") NetSalesGrid: GridComponent;
  @ViewChild("Tax") TaxGrid: GridComponent;
  @ViewChild("ReturnOrder") ReturnOrderGrid: GridComponent;
  @ViewChild("DeletedOrder") DeletedOrderGrid: GridComponent;
  @ViewChild("DiscountedOrder") DiscountedOrderGrid: GridComponent;
  @ViewChild("TransferdDetail") TransferdDetailGrid: GridComponent;
  @ViewChild("CanceledProduct") CanceledProductGrid: GridComponent;
  @ViewChild("ExtraExpense") ExtraExpenseGrid: GridComponent;

  @ViewChild("detailgrid") detailgrid: GridComponent;
  @ViewChild("Totals") Totals: GridComponent;
  @ViewChild("Credit") Credit: GridComponent;
  @ViewChild("UserNetSale") UserNetSalesGrid: GridComponent;
  @ViewChild("EmpsGrid") EmpsGrid: GridComponent;
  @ViewChild("ProductItemsGrid") ProductItemsGrid: GridComponent;
  @ViewChild("ProductsubItemGrid") ProductsubItemGrid: GridComponent;
  @ViewChild("CanceledProductsGrid") CanceledProductsGrid: GridComponent;
  showprint = false;
  //#endregion

  sections = [
    {
      printflag: 2,
      permission: 'CanViewMeals',
      label: 'Reports.Products',
      placeholder: 'Product',
      dataSource: 'ProductsLookUps',
      modelBinding: 'ProductDocumentIdList',
      actionMethod: 'GetProductDataReport',
      component: 'multiselect'
    },
    {
      printflag: 3,
      permission: 'CanViewMeals',
      label: 'Reports.ProductGroups',
      placeholder: 'ProductGroups',
      dataSource: 'ProductGroupsLookUps',
      modelBinding: 'ProductGroupsDocumentIdList',
      actionMethod: 'GetProductGroupDataReport',
      component: 'multiselect'
    },
    {
      printflag: 4,
      permission: 'CanViewMeals',
      label: 'Reports.ProductGroups',
      placeholder: 'ProductGroups',
      dataSource: 'ProductGroupsLookUps',
      modelBinding: 'ProductGroupsDocumentIdList',
      actionMethod: 'GetProductGroupDataReport',
      component: 'multiselect'
    },
    {
      printflag: 8,
      permission: 'CanViewTypesOfMeals',
      label: 'Shared.producttype',
      placeholder: 'ProductTypes',
      dataSource: 'allProductTypes',
      modelBinding: 'ProductTypesDocumentIdList',
      actionMethod: 'GetProductTypeDataReport',
      component: 'multiselect'
    },
    {
      printflag: 33,
      permission: 'CanViewCustomerOrdersReport',
      label: 'manageorder.Customer',
      placeholder: 'Shared.searchByPhoneorNumber',
      dataSource: 'customers',
      modelBinding: 'CustomerDocumentId',
      actionMethod: '',
      component: 'combobox'
    },
    {
      printflag: 33,
      permission: 'CanViewCustomerOrdersReport',
      label: 'Reports.ProcessedType',
      placeholder: 'Reports.ProcessedType',
      dataSource: 'processeds',
      modelBinding: 'ProcessedEnum',
      actionMethod: 'getCustomerOrdersDataReport',
      component: 'combobox'
    },
    {
      printflag: 39,
      permission: 'CanViewCustomerOrdersReport',
      label: 'Reports.ProcessedType',
      placeholder: 'Reports.ProcessedType',
      dataSource: 'processeds',
      modelBinding: 'ProcessedEnum2',
      actionMethod: 'getCustomerOrdersDataReport',
      component: 'combobox'
    },
    {
      printflag: 9,
      permission: 'CanViewCustomer',
      label: 'manageorder.Customer',
      placeholder: 'Shared.searchByPhoneorNumber',
      dataSource: 'customers',
      modelBinding: 'CustomerDocumentId',
      actionMethod: 'GetCustomerDataReport',
      component: 'combobox'
    },
    {
      printflag: 15,
      permission: 'CanViewTermCustomerReport',
      label: 'manageorder.Customer',
      placeholder: 'Shared.searchByPhoneorNumber',
      dataSource: 'customers',
      modelBinding: 'CustomerDocumentId',
      actionMethod: 'GetCreditDataReport',
      component: 'combobox',
      additionalFiltering: true
    },
    {
      printflag: 29,
      permission: 'CanViewWaiterReport',
      label: 'manageorder.Waiter',
      placeholder: 'manageorder.Waiter',
      dataSource: 'allWaiters',
      modelBinding: 'WaitersDocumentIdList',
      actionMethod: 'getWaiterDataReport',
      component: 'multiselect'
    },
    {
      printflag: 28,
      permission: 'CanViewCaptainReport',
      label: 'manageorder.Captain',
      placeholder: 'manageorder.Captain',
      dataSource: 'allCaptains',
      modelBinding: 'CaptainsDocumentIdList',
      actionMethod: 'getCaptainDataReport',
      component: 'multiselect'
    },
    {
      printflag: 17,
      permission: 'CanViewReportEmployeeRequests',
      label: 'Printer.EmpsOrders',
      placeholder: 'Printer.EmpsOrders',
      dataSource: 'allEmployees',
      modelBinding: 'EmpDocumentIdList',
      actionMethod: 'GetEmpsReport',
      component: 'multiselect'
    },
    {
      printflag: 35,
      permission: 'CanViewProductMovementsReport',
      label: 'Reports.Products',
      placeholder: 'Reports.Products',
      dataSource: 'ProductsLookUps',
      modelBinding: 'ProductDocumentIdList',
      actionMethod: 'GetProductMovementsDataReport',
      component: 'multiselect'
    },
  ];


  @Output() extraExpensesResponse: EventEmitter<any> = new EventEmitter();

  constructor(
    public salesReportService: SalesReportService,
    public productService: ProductService,
    public productGroupService: ProductGroupService,
    public productTypeService: ProductTypeService,
    public employeeService: EmployeeService,
    public orderSer: OrderService,
    public translate: TranslateService,
    public dashboardSer: DashboardService,
    public followOrdersService: FollowOrdersService,
    private languageSerService: LanguageSerService,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages,
    public SettingSer: SettingService,
    public router: Router,
    public _ExtraExpensesService: ExtraExpensesService,
    public customerOrderService: CustomerOrderService,

  ) {
    this.initializeobjects();
  }

  ngOnInit(): void {
    this.GetSettings();
    this.printDetailobj.DestinationId = 1;
    this.fields = { text: "Name", value: "Id" };
    this.TableFlds = { text: "Name", value: "DocumentId" };
    this.responseobj.FromDate = new Date();
    this.responseobj.ToDate = new Date();
    this.GetData();
    Stimulsoft.Base.StiLicense.key =
      "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlkHnETZDQa/PS+0KAqyGT4DpRlgFmGegaxKasr/6hj3WTsNs" +
      "zXi2AnvR96edDIZl0iQK5oAkmli4CDUblYqrhiAJUrUZtKyoZUOSwbjhyDdjuqCk8reDn/QTemFDwWuF4BfzOqXcdV" +
      "9ceHmq8jqTiwrgF4Bc35HGUqPq+CnYqGQhfU3YY44xsR5JaAuLAXvuP05Oc6F9BQhBMqb6AUXjeD5T9OJWHiIacwv0" +
      "LbxJAg5a1dVBDPR9E+nJu2dNxkG4EcLY4nf4tOvUh7uhose6Cp5nMlpfXUnY7k7Lq9r0XE/b+q1f11KCXK/t0GpGNn" +
      "PL5Xy//JCUP7anSZ0SdSbuW8Spxp+r7StU/XLwt9vqKf5rsY9CN8D8u4Mc8RZiSXceDuKyhQo72Eu8yYFswP9COQ4l" +
      "gOJGcaCv5h9GwR+Iva+coQENBQyY2dItFpsBwSAPvGs2/4V82ztLMsmkTpoAzYupvE2AoddxArDjjTMeyKowMI6qtT" +
      "yhaF9zTnJ7X7gs09lgTg7Hey5I1Q66QFfcwK";
  }
  GetData() {
    this.initializeGrid();
    this.getAllUsers();
    this.GetAllOrderTypes();
    this.GetAllPaymentTypes();
    this.getAllBranches();
    this.GetAllPOS();
    this.GetAllTables();
    this.GetAllHalls();
    this.UserWithPermission();
    this.GetAllProductLookUps();
    this.GetProductGroupsLookUps();
    this.getProductTypesList();
    this.getEmployeeLookUps();
  }
  UserWithPermission() {
    this.salesReportService.GetUserReportsPermission().subscribe(
      (res: any) => {
        this.userPermissions = res.userPermissions;
        this.isAdmin = res.isAdmin;
      }
    );
  }


  isGrantedReport(permissionName:string){
    if(this.isAdmin)
      return true;
    else{
      if(!this.userPermissions) return false;

      const permission = this.userPermissions.find(x=> x.Name == permissionName);
      if(permission) return true;
      else return false;
    }
  }
  initializeobjects() {
    this.printDetailobj = {};
    this.languageSerService.currentLang.subscribe((lan) => this.translate.use(lan));
    // this.translate.use(this.language);
  }
  initializeGrid(): void {
    this.pageSettings = { pageSizes: true, pageSize: 10 };
    this.toolbarOptions = ["Search", "ExcelExport"];
    this.filterOptions = {
      type: "Menu"
    };
  }
  toolbarClickProductsubItemGrid(args: ClickEventArgs): void {
    if (args.item.id === "ProductsubItemGrid_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.ProductsubItemGrid.pdfExport();
    }
    if (args.item.id === "ProductsubItemGrid_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.ProductsubItemGrid.excelExport();
    }
  }
  toolbarClickCanceledProductsGrid(args: ClickEventArgs): void {
    if (args.item.id === "CanceledProductsGrid_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.CanceledProductsGrid.pdfExport();
    }
    if (args.item.id === "CanceledProductsGrid_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.CanceledProductsGrid.excelExport();
    }
  }
  toolbarClickTransferdGrid(args: ClickEventArgs): void {
    if (args.item.id === "TransferdGrid_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.TransferdGrid.pdfExport();
    }
    if (args.item.id === "TransferdGrid_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.TransferdGrid.excelExport();
    }
  }
  toolbarClickProductItemsGrid(args: ClickEventArgs): void {
    if (args.item.id === "ProductItemsGrid_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.ProductItemsGrid.pdfExport();
    }
    if (args.item.id === "ProductItemsGrid_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.ProductItemsGrid.excelExport();
    }
  }
  toolbarClickDataCustomer(args: ClickEventArgs): void {
    if (args.item.id === "Credit_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.Credit.pdfExport();
    }
    if (args.item.id === "Credit_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.Credit.excelExport();
    }
  }
  toolbarClickOrders(args: ClickEventArgs): void {
    if (args.item.id === "Order_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.OrdersGrid.pdfExport();
    }
    if (args.item.id === "Order_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.OrdersGrid.excelExport();
    }
  }
  toolbarClickDeletedOrders(args: ClickEventArgs): void {
    if (args.item.id === "DeletedOrder_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.DeletedOrderGrid.pdfExport();
    }
    if (args.item.id === "DeletedOrder_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.DeletedOrderGrid.excelExport();
    }
  }
  toolbarClickCanceledProducts(args: ClickEventArgs): void {
    if (args.item.id === "CanceledProduct_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.CanceledProductGrid.pdfExport();
    }
    if (args.item.id === "CanceledProduct_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.CanceledProductGrid.excelExport();
    }
  }
  toolbarClickTransferdDetails(args: ClickEventArgs): void {
    if (args.item.id === "TransferdDetail_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.TransferdDetailGrid.pdfExport();
    }
    if (args.item.id === "TransferdDetail_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.TransferdDetailGrid.excelExport();
    }
  }
  toolbarClickDiscountedOrders(args: ClickEventArgs): void {
    if (args.item.id === "DiscountedOrder_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.DiscountedOrderGrid.pdfExport();
    }
    if (args.item.id === "DiscountedOrder_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.DiscountedOrderGrid.excelExport();
    }
  }
  toolbarClickExtraExpenses(args: ClickEventArgs): void {
    if (args.item.id === "ExtraExpenses_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.ExtraExpensesGrid.pdfExport();
    }
    if (args.item.id === "ExtraExpenses_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.ExtraExpensesGrid.excelExport();
    }
  }
  toolbarClickTotals(args: ClickEventArgs): void {
    if (args.item.id === "Totals_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.Totals.pdfExport();
    }
    if (args.item.id === "Totals_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.Totals.excelExport();
    }
  }
  toolbarClickReturnOrders(args: ClickEventArgs): void {
    if (args.item.id === "ReturnOrder_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.ReturnOrderGrid.pdfExport();
    }
    if (args.item.id === "ReturnOrder_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.ReturnOrderGrid.excelExport();
    }
  }
  toolbarClickproducts(args: ClickEventArgs): void {
    if (args.item.id === "Product_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.ProductGrid.pdfExport();
    }
    if (args.item.id === "Product_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.ProductGrid.excelExport();
    }
  }
  toolbarClickproductGroupsChild(args: ClickEventArgs): void {
    if (args.item.id === "ProductGroupChild_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.ProductGroupGrid.pdfExport();
    }
    if (args.item.id === "ProductGroupChild_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.ProductGroupGrid.excelExport({ hierarchyExportMode: "All" });
    }
  }
  toolbarClickproductGroupsChild1(args: ClickEventArgs): void {
    if (args.item.id === "ProductGroupChild1_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.ProductGroupGrid1.pdfExport();
    }
    if (args.item.id === "ProductGroupChild1_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.ProductGroupGrid1.excelExport({ hierarchyExportMode: "All" });
    }
  }
  toolbarClickDate(args: ClickEventArgs): void {
    if (args.item.id === "Date_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.DateGrid.pdfExport();
    }
    if (args.item.id === "Date_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.DateGrid.excelExport();
    }
  }
  toolbarClickTips(args: ClickEventArgs): void {
    if (args.item.id === "Tips_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.TipsGrid.pdfExport();
    }
    if (args.item.id === "Tips_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.TipsGrid.excelExport();
    }
  }
  toolbarClickOrderType(args: ClickEventArgs): void {
    if (args.item.id === "OrderType_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.OrderTypeGrid.pdfExport();
    }
    if (args.item.id === "OrderType_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.OrderTypeGrid.excelExport();
    }
  }
  toolbarClickOrderPayType(args: ClickEventArgs): void {
    if (args.item.id === "OrderPayType_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.OrderPayTypeGrid.pdfExport();
    }
    if (args.item.id === "OrderPayType_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.OrderPayTypeGrid.excelExport();
    }
  }
  toolbarClickCaptain(args: ClickEventArgs): void {
    if (args.item.id === "Captain_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.CaptainGrid.pdfExport();
    }
    if (args.item.id === "Captain_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.CaptainGrid.excelExport();
    }
  }
  toolbarClickCaptainGrid1(args: ClickEventArgs): void {
    if (args.item.id === "CaptainGrid1_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.CaptainGrid1Grid.pdfExport();
    }
    if (args.item.id === "CaptainGrid1_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.CaptainGrid1Grid.excelExport();
    }
  }
  toolbarClickCustomerOrders1(args: ClickEventArgs): void {
    if (args.item.id === "CustomerOrders1_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.CustomerOrders1Grid.pdfExport();
    }
    if (args.item.id === "CustomerOrders1_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.CustomerOrders1Grid.excelExport();
    }
  }
  toolbarClickPos(args: ClickEventArgs): void {
    if (args.item.id === "Pos_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.PosGrid.pdfExport();
    }
    if (args.item.id === "Pos_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.PosGrid.excelExport();
    }
  }
  toolbarClickHall(args: ClickEventArgs): void {
    if (args.item.id === "Hall_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.HallGrid.pdfExport();
    }
    if (args.item.id === "Hall_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.HallGrid.excelExport({ hierarchyExportMode: "All" });
    }
  }
  toolbarClickUser(args: ClickEventArgs): void {
    if (args.item.id === "User_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.UserGrid.pdfExport();
    }
    if (args.item.id === "User_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.UserGrid.excelExport();
    }
  }
  toolbarClickProductType(args: ClickEventArgs): void {
    if (args.item.id === "ProductType_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.ProductTypeGrid.pdfExport();
    }
    if (args.item.id === "ProductType_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.ProductTypeGrid.excelExport();
    }
  }
  toolbarClickCustomer(args: ClickEventArgs): void {
    if (args.item.id === "Customer_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.CustomerGrid.pdfExport();
    }
    if (args.item.id === "Customer_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.CustomerGrid.excelExport({ hierarchyExportMode: "All" });
    }
  }
  toolbarClickNetSales(args: ClickEventArgs): void {
    if (args.item.id === "NetSales_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.NetSalesGrid.pdfExport();
    }
    if (args.item.id === "NetSales_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.NetSalesGrid.excelExport();
    }
  }
  toolbarClickTax(args: ClickEventArgs): void {
    if (args.item.id === "Tax_pdfexport") {
      // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.TaxGrid.pdfExport();
    }
    if (args.item.id === "Tax_excelexport") {
      // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.TaxGrid.excelExport();
    }
  }
  toolbarClick5(args: ClickEventArgs): void {

    // if (args.item.id === 'NetSales_excelexport') { // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
    this.OrdersGrid.excelExport();
    //}
  }
  getAllUsers() {
    this.dashboardSer.getAllUsersInfo().subscribe(
      (res) => {
        this.UserList = res as any;
        this.UserFlds = { text: "UserName", value: "AppUserId" };
      },
      (res) => {
      }
    );
  }

  getAllBranches() {
    this.salesReportService.GetAllBranches().subscribe(
      (res) => {
        this.BranchList = res as any;
        this.BrancheFlds = { text: "Name", value: "DocumentId" };
      },
      (res) => {
      }
    );
  }
  GetAllTables() {
    this.salesReportService.GetAllTables().subscribe(
      (res) => {
        this.TableList = res as any;
      }
    );
  }
  GetAllHalls() {
    this.salesReportService.GetAllHalls().subscribe(
      (res) => {
        this.HallList = res as any;
      }
    );
  }

  GetAllProductLookUps() {
    this.productService.getProductsLookUps().subscribe(
      (res) => {
        this.ProductsLookUps = res as any;
      }
    );
  }
  GetProductGroupsLookUps() {
    this.productGroupService.GetProductGroupsLookUps().subscribe(
      (res) => {
        this.ProductGroupsLookUps = res as any;
      }
    );
  }
  getProductTypesList() {
    this.productTypeService.getProductTypes().subscribe(
      (res) => {
        this.allProductTypes = res as any;
      }
    );
  }
  getEmployeeLookUps() {
    this.employeeService.GetEmployeeLookUps().subscribe(
      (res) => {
        this.allEmployees = res as any;
        if(this.allEmployees?.length){
          this.allWaiters = this.allEmployees?.filter(x=> x.UserType == 5);
          this.allCaptains = this.allEmployees?.filter(x=> x.UserType == 7);
        }
      }
    );
  }

  GetAllPOS() {
    this.salesReportService.GetAllPOS().subscribe(
      (res) => {
        this.POSList = res as any;
        this.POSFlds = { text: "Name", value: "DocumentId" };
      },
      (res) => {
      }
    );
  }
  GetAllOrderTypes() {
    this.salesReportService.GetAllOrderTypes().subscribe(
      (res) => {
        this.OrderTypeList = res as any;
        this.OrderTypeFlds = { text: "Name", value: "DocumentId" };
      },
      (res) => {
      }
    );
  }

  GetAllPaymentTypes() {
    this.salesReportService.GetAllPaymentTypes().subscribe(
      (res) => {
        this.PaymentTypeList = res as any;
        this.PaymentTypeFlds = { text: "Name", value: "DocumentId" };
      },
      (res) => {
      }
    );
  }

  GetDataReportOrders() {
    this.requestStarted = true;
    this.selectSection(1);
    this.showReport = true;
    this.showprint = true;
    this.printflag = 1;
    this.salesReportService.GetDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.Orders = res as any;
    });
  }

  GetProductDataReport() {
    this.requestStarted = true;
    this.selectSection(2);
    this.showprint = true;
    this.printflag = 2;
    this.salesReportService.GetProductDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.Products = res as any;
    });
  }

  onWithoutSideDishChange(_e: any) {
    this.responseobj.ProductWithoutSideDish = _e.target?.checked;
    if (this.printflag === 2) {
      this.GetProductDataReport();
    } else if (this.printflag === 35) {
      this.GetProductMovementsDataReport();
    }
  }
  GetProductGroupDataReport() {
    this.showprint = true;
    this.requestStarted = true;
    this.selectSection(4);
    this.printflag = 4;
    this.salesReportService.GetProductGroupDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.IcomingData = res as any;

      this.ProductGroups = this.IcomingData.FirstList;
      if (this.ProductGroups != null && this.ProductGroups != undefined) {
        let obj = this.ProductGroups[0];
        if (obj?.UseTax) {
          this.UseTax = true;
        }
      }
      this.child = {
        dataSource: this.IcomingData.products,
        queryString: "ProductGroupDocumentId",
        allowPaging: true,
        pageSettings: { pageSizes: true, pageSize: 8 },
        columns: [
          { field: "ProductName", headerText: "Product Name" },
          { field: "ProductPrice", headerText: "Product Price" },
          { field: "ProductQuantity", headerText: "Product Quantity" },
          { field: "TaxAmount", headerText: "Tax Amount" },
          { field: "DiscountAmount", headerText: "Discount Amount" },
          { field: "ServiceChargeValue", headerText: "Service Charge" },
          { field: "NetTotal", headerText: "NetTotal" }
        ]
      };
      if (
        this.IcomingData.orders != undefined &&
        this.IcomingData.orders != null &&
        this.UserList != undefined &&
        this.UserList != null
      ) {
        this.IcomingData.orders.forEach((item) => {
          this.UserList.forEach((item2) => {
            if (item2.AppUserId == item.CloserUserId) {
              item.CloserUserName = item2.UserName;
            }
          });
        });
      }
      this.child1 = {
        dataSource: this.IcomingData.orders,
        queryString: "ProductGroupDocumentId",
        allowPaging: true,
        pageSettings: { pageSizes: true, pageSize: 8 },
        columns: [
          { field: "CloseTime", headerText: "Close Time" },
          { field: "Closedate", headerText: "Close date" },
          { field: "OrderNum", headerText: "Order Number" },
          { field: "OrderTypeName", headerText: "Order Type" },
          { field: "OrderPayTypes", headerText: "Pay Types" },
          { field: "CustomerName", headerText: "Customer Name" },
          { field: "ReceiverName", headerText: "Receiver Name" },
          { field: "CloserUserName", headerText: "User Name" },
          { field: "ProductName", headerText: "Product Name" , width: 150},
          { field: "ProductQuantity", headerText: "Product Quantity" },
          { field: "ProductPrice", headerText: "Product Price" },
          { field: "Total", headerText: "Total" }
        ]
      };
    });
  }

  GetDateDataReport() {
    this.requestStarted = true;
    this.selectSection(5);
    this.showprint = true;
    this.printflag = 5;
    this.salesReportService.GetDateDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.DateData = res as any;
    });
  }

  GetOrderPayTypeDataReport() {
    this.requestStarted = true;
    this.selectSection(6);
    this.showprint = true;
    this.printflag = 6;

    this.salesReportService.GetOrderPayTypeDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.OrderPayTypes = res as any;
    });
  }

  /*    GetHallDataReport(){
                    this.showprint=true;

                    this.salesReportService.GetHallDataReport(this.responseobj).subscribe(
                      res=>{
                        this.DataHalls=res as any;
                        this.Halls=this.DataHalls.Halls;
                        this.DataHalls.orders.forEach(order => {
                          this.UserList.forEach(user => {

                            if(order.ClosingUserId==user.AppUserId){
                               order.ClosingUserName=user.UserName;

                            }
                          });
                        });
                        console.log(this.DataHalls.orders);
                        this.childGrid = {
                          dataSource: this.DataHalls.Tables,
                          queryString: 'HallId',
                          columns: [
                              { field: 'Name', headerText: 'Name', textAlign: 'Right', width: 120 },


                          ],

                          childGrid: {
                              dataSource: this.DataHalls.orders,
                              queryString: 'TableId',
                              columns: [
                                  { field: 'CloseTime', headerText: 'Close Time', width: 100 },
                                  { field: 'Closedate', headerText: 'Close date', width: 75 },
                                  { field: 'OrderNumber', headerText: 'Order Number', width: 100 },
                                  { field: 'ClosingUserName', headerText: 'ClosingUserName', width: 120 },
                                  { field: 'Total', headerText: 'Total', width: 100 },
                                  { field: 'AllOrderPaymentNames', headerText: 'Order Payment', width: 120 },
                                  { field: 'DiscountAmount', headerText: 'Discount Amount', width: 100 },
                                  { field: 'TotalTaxAmount', headerText: 'Tax Amount', width: 100 },
                                  { field: 'ServiceChargeValue', headerText: 'Service Charge', width: 120 },
                                  { field: 'SubTotal', headerText: 'SubTotal', width: 100 }
                              ]
                          }
                      };
                    });
                  } */
  GetUserDataReport() {
    this.requestStarted = true;
    this.selectSection(7);
    this.showprint = true;
    this.printflag = 7;
    this.salesReportService.GetUserDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.Users = res as any;
      this.Users.forEach((order) => {
        this.UserList.forEach((user) => {
          if (order.ClosingUserId == user.AppUserId) {
            order.ClosingUserName = user.UserName;
          }
        });
      });
    });
  }

  GetProductTypeDataReport() {
    this.requestStarted = true;
    this.selectSection(8);
    this.showprint = true;
    this.printflag = 8;
    this.salesReportService.GetProductTypeDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.ProductTypes = res as any;
    });
  }

  GetCustomerDataReport() {
    this.requestStarted = true;
    this.selectSection(9);
    this.showprint = true;
    this.printflag = 9;
    this.salesReportService.GetCustomerDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.CustomersData = res as any;
      this.Customers = this.CustomersData.Customers;
      this.childCustomer = {
        dataSource: this.CustomersData.Orders,
        queryString: "CustomerDocumentId",
        allowPaging: true,
        pageSettings: { pageSizes: true, pageSize: 8 },
        columns: [
          { field: "CloseDate", headerText: this.translate.instant("Shared.Closedate"), width: 120 },
          { field: "OrderNumber", headerText: this.translate.instant("delivery.orderNumber"), width: 70 },
          {
            field: "DiscountAmount",
            headerText: this.translate.instant("Shared.DiscountAmount"),
            width: 70
          },
          { field: "TotalTaxAmount", headerText: this.translate.instant("Shared.TaxAmount"), width: 70 },
          {
            field: "ServiceChargeValue",
            headerText: this.translate.instant("Shared.ServiceChargeValue"),
            width: 120
          },
          { field: "SubTotal", headerText: this.translate.instant("delivery.Subtotal"), width: 100 },
          { field: "PointsPerOrder", headerText: this.translate.instant("Reports.PointsPerOrder"), width: 100 },
          { field: "ExpiredDate", headerText: this.translate.instant("Shared.ExpireDate"), width: 100 },
          { field: "PointsCountApplied", headerText: this.translate.instant("Shared.RedeemPoints"), width: 100 }
        ]
      };
    });
  }
  GetReturnOrderReport() {
    this.requestStarted = true;
    this.selectSection(10);
    this.showReport = true;
    this.showprint = true;
    this.printflag = 10;
    this.salesReportService.GetReturnOrderReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.ReturnOrders = res as any;
      this.ReturnOrders?.forEach((returnorder) => {
        this.UserList?.forEach((user) => {
          if (returnorder.CashierId == user.AppUserId) {
            returnorder.CashierName = user.UserName;
          }
        });
      });
    });
  }
  GetOrderTypeDataReport() {
    this.requestStarted = true;
    this.selectSection(11);
    this.showprint = true;
    this.printflag = 11;
    this.salesReportService.GetOrderTypeDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.OrderTypes = res as any;
    });
  }
  GetTaxDataReport() {
    this.requestStarted = true;
    this.selectSection(12);
    this.showprint = true;
    this.printflag = 12;
    this.salesReportService.GetTaxDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.Taxes = res as any;
    });
  }
  GetDeletedOrders() {
    this.requestStarted = true;
    this.selectSection(13);
    this.showprint = true;
    this.printflag = 13;
    this.salesReportService.GetDeletedOrdersReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.DeletedOrders = res as any;
    });
  }
  GetTotalsReport() {
    this.requestStarted = true;
    this.selectSection(14);
    this.showprint = true;
    this.printflag = 14;
    this.salesReportService.GetTotals(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.TotalsData = res as any;
    });
  }
  GetCreditDataReport() {
    this.requestStarted = true;
    this.selectSection(15);
    this.showprint = true;
    this.printflag = 15;
    this.salesReportService.GetCreditDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.CreditData = res as any;
      this.CreditDataCustomer = this.CreditData.Customers;
    },
    (error)=>{
      this.requestStarted = false;
    });
  }
  GetOnlineCompaniesReport() {
    this.requestStarted = true;
    this.selectSection(26);
    this.showprint = true;
    this.printflag = 26;
    this.salesReportService.GetOnlineCompaniesDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.CreditData = res as any;
      this.OnlineCompaniesData = this.CreditData.Customers;
    },
    (error)=>{
      this.requestStarted = false;
    });
  }
  GetNetSalseReport() {
    this.requestStarted = true;
    this.selectSection(16);
    this.showReport = true;
    this.showprint = true;
    this.printflag = 16;
    this.salesReportService.GetNetSalseReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.UserNetSales = res as any;
    });
  }
  GetEmpsReport() {
    this.requestStarted = true;
    this.selectSection(17);
    this.showReport = true;
    this.showprint = true;
    this.printflag = 17;
    this.salesReportService.GetEmpsReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.Emps = res as any;
    });
  }
  GetProductsubItemDataReport() {
    this.requestStarted = true;
    this.selectSection(18);
    this.showReport = true;
    this.showprint = true;
    this.printflag = 18;
    this.salesReportService.GetProductsubItemDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.ProductsubItem = res as any;
    });
  }
  GetProductItemsDataReport() {
    this.requestStarted = true;
    this.selectSection(19);
    this.showReport = true;
    this.showprint = true;
    this.printflag = 19;
    this.salesReportService.GetProductItemsDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.ProductItems = res as any;
    });
  }
  GetCanceledProductsReport() {
    this.requestStarted = true;
    this.selectSection(20);
    this.showReport = true;
    this.showprint = true;
    this.printflag = 20;
    this.salesReportService.GetCanceledProductsReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.CanceledProducts = res as any;
    });
  }

  PrintOrder(data: any) {
    this.requestStarted = true;
    let order = this.getReportTranslationObj(data);
    this.orderSer.PrintWithPreview(order).subscribe(
      (data: any) => {
        this.requestStarted = false;
        //  var report = new Stimulsoft.Report.StiReport();
        this.reprtresult = data?.report;
        this.report.loadDocument(this.reprtresult);
        // Render report
        this.report.renderAsync();

        // Create an HTML settings instance. You can change export settings.
        var settings = new Stimulsoft.Report.Export.StiHtmlExportSettings();
        // Create an HTML service instance.
        var service = new Stimulsoft.Report.Export.StiHtmlExportService();
        // Create a text writer objects.
        var textWriter = new Stimulsoft.System.IO.TextWriter();
        var htmlTextWriter = new Stimulsoft.Report.Export.StiHtmlTextWriter(textWriter);
        // Export HTML using text writer.
        service.exportTo(this.report, htmlTextWriter, settings);
        //  var contents =(<HTMLInputElement>document.getElementById("FrameDIv")).innerHTML;
        var frame1 = document.createElement("iframe");
        frame1.name = "frame1";
        frame1.style.position = "absolute";
        frame1.style.top = "-1000000px";
        document.body.appendChild(frame1);
        var frameDoc =
          (<HTMLIFrameElement>frame1).contentDocument || (<HTMLIFrameElement>frame1).contentWindow.document;
        frameDoc.open();
        frameDoc.write("</head><body>");
        frameDoc.write(textWriter.getStringBuilder().toString());
        frameDoc.write("</body></html>");
        frameDoc.close();
        setTimeout(function () {
          window.frames["frame1"].focus();
          window.frames["frame1"].print();
          document.body.removeChild(frame1);
        }, 500);
        return false;
      },
      (err) => {
        this.requestStarted = false;
      }
    );
  }
  PrintReturnOrder(data: any) {
    this.requestStarted = true;
    this.model = [];
    if (this.printDetailobj.LanguageId == 1) {
      this.model.push(data.DocumentId);
      this.myjson = en["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 2) {
      this.model.push(data.DocumentId);
      this.myjson = ar["Reports"];
      this.model.push(this.myjson);
      this.model.push("ar");
    }
    if (this.printDetailobj.LanguageId == 3) {
      this.model.push(data.DocumentId);
      this.myjson = tr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.model.push(data.DocumentId);
      this.myjson = fr["Reports"];
      this.model.push(this.myjson);
      this.model.push("en");
    }
    this.model.push(this.printDetailobj.PrintModelId);
    this.model.push(this.printDetailobj.DestinationId);
    this.model.push(this.printDetailobj.FileFormatId);

    if (this.printDetailobj.DestinationId == 2) {
      this.model.push(this.printDetailobj.Reciever);
      this.model.push(this.printDetailobj.Title);
      this.model.push(this.printDetailobj.Message);
      this.ifPerview = false;
    } else {
      this.ifPerview = true;
    }
    this.salesReportService.PrintPreviewReturnOrder(this.model).subscribe((data: Response) => {
      this.requestStarted = false;

      this.loading = false;
      this.reprtresult = data;

      this.report.loadDocument(this.reprtresult);

      // Render report
      this.report.renderAsync();

      // Create an HTML settings instance. You can change export settings.
      var settings = new Stimulsoft.Report.Export.StiHtmlExportSettings();
      // Create an HTML service instance.
      var service = new Stimulsoft.Report.Export.StiHtmlExportService();
      // Create a text writer objects.
      var textWriter = new Stimulsoft.System.IO.TextWriter();
      var htmlTextWriter = new Stimulsoft.Report.Export.StiHtmlTextWriter(textWriter);

      // Export HTML using text writer.
      service.exportTo(this.report, htmlTextWriter, settings);
      //  var contents =(<HTMLInputElement>document.getElementById("FrameDIv")).innerHTML;
      var frame1 = document.createElement("iframe");
      frame1.name = "frame1";
      frame1.style.position = "absolute";
      frame1.style.top = "-10000000px";
      document.body.appendChild(frame1);
      var frameDoc = (<HTMLIFrameElement>frame1).contentDocument || (<HTMLIFrameElement>frame1).contentWindow.document;
      frameDoc.open();
      frameDoc.write("</head><body>");
      frameDoc.write(textWriter.getStringBuilder().toString());
      frameDoc.write("</body></html>");
      frameDoc.close();
      setTimeout(function () {
        window.frames["frame1"].focus();
        window.frames["frame1"].print();
        document.body.removeChild(frame1);
      }, 500);
    });
    this.ifPerview = false;

    return false;
  }

  Print() {
    this.requestStarted = true;
    const format = "dd/MM/yyyy";
    const locale = "en-US";
    let fromdata: string = "";
    let ToDate: string = "";
    let fromtime: string = "";
    let Totime: string = "";
    if (this.responseobj != undefined && this.responseobj.FromDate) {
      fromdata = getOnlyDateFromString(this.responseobj.FromDate.toString());
    }
    if (this.responseobj != undefined && this.responseobj.ToDate) {
      ToDate = getOnlyDateFromString(this.responseobj.ToDate.toString());
    }
    if (this.responseobj != undefined && this.responseobj.FromTime != undefined) {
      fromtime = this.responseobj.FromTime.toString();
    }
    if (this.responseobj != undefined && this.responseobj.ToTime != undefined) {
      Totime = this.responseobj.ToTime.toString();
    }

    let UsersName: any = "";
    if (
      this.responseobj.UsersList != undefined &&
      this.responseobj.UsersList != null &&
      this.responseobj.UsersList.length > 0
    ) {
      this.responseobj.UsersList.forEach((item) => {
        UsersName += this.UserList.filter((x) => x.AppUserId == item)[0].UserName;
        let breakname = ",";
        UsersName = UsersName + breakname;
      });
    }
    if (this.printDetailobj.LanguageId == 1) {
      this.myjson = en["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
      this.responseobj.ReportOptions =
        this.responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        this.responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        this.responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        this.responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        this.responseobj.Labels["Users"] +
        ":" +
        UsersName;
    }

    if (this.printDetailobj.LanguageId == 2) {
      this.myjson = ar["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "ar";
      this.responseobj.ReportOptions =
        fromdata +
        ":" +
        this.responseobj.Labels["Fromdate"] +
        "\n" +
        ToDate +
        ":" +
        this.responseobj.Labels["Todate"] +
        "\n" +
        fromtime +
        ":" +
        this.responseobj.Labels["FromTime"] +
        "\n" +
        Totime +
        ":" +
        this.responseobj.Labels["ToTime"] +
        "\n" +
        UsersName +
        ":" +
        this.responseobj.Labels["Users"];
    }
    if (this.printDetailobj.LanguageId == 3) {
      this.myjson = tr["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
      this.responseobj.ReportOptions =
        this.responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        this.responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        this.responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        this.responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        this.responseobj.Labels["Users"] +
        ":" +
        UsersName;
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.myjson = fr["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
      this.responseobj.ReportOptions =
        this.responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        this.responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        this.responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        this.responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        this.responseobj.Labels["Users"] +
        ":" +
        UsersName;
    }
    if (this.printflag == 1) {
      this.salesReportService.PrintOrdersReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("kds.orders"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
      });
    }
    if (this.printflag == 2) {
      this.salesReportService.printProductReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Printer.Products"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 3) {
      this.salesReportService.PrintProductGroupOrdersReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Shared.Detailaccordingtotheorder"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 4) {
      this.responseobj.ProductGroupDocumentId = this.ProductGroupDocumentId;
      this.salesReportService.PrintProductGroupProductsReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Shared.Totalpermeal"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 5) {
      this.salesReportService.PrintDateReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("CashReceipt.Date"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 6) {
      this.salesReportService.printOrderPayTypeReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Shared.PaymentType"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }

    if (this.printflag == 7) {
      this.salesReportService.PrintUserReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Shared.user"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 8) {
      this.salesReportService.PrintProductTypeReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Shared.producttype"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 9) {
      this.salesReportService.PrintCustomerReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("manageorder.Customer"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 10) {
      this.salesReportService.PrintReturnOrdersReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Shared.returnorderReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 11) {
      this.salesReportService.PrintOrderTypeReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Printer.OrderType"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 12) {
      this.salesReportService.PrintTaxesReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Printer.Taxes"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }

    if (this.printflag == 13) {
      this.salesReportService.PrintDeletedOrdersReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Shared.DeletedOrders"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 14) {
      this.salesReportService.PrintTotalsReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Printer.Totals"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 15) {
      this.salesReportService.PrintCreditDataReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Printer.CreditReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 16) {
      this.salesReportService.PrintNetSalesReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Printer.NetSalesReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 20) {
      this.salesReportService.PrintCancelledOrdersReport(this.responseobj).subscribe((data: Response) => {

        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Shared.CancelledOrders"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 22) {
      this.salesReportService.PrintTransferdOrdersReport(this.responseobj).subscribe((data: Response) => {

        this.Reportdata = data;
        // localForage.setItem('Reportdata', this.Reportdata);
        // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
        // window.open(link, '_blank');
        this.tabs.push({
          title: this.translate.instant("Reports.TransferdOrdersReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 23) {
      this.salesReportService.PrintDiscountedOrdersReport(this.responseobj).subscribe((data: Response) => {

        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("Reports.DiscountedOrdersReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 24) {
      this.salesReportService.PrintExtraExpensesReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("Reports.ExtraExpensesReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 25) {
      this.salesReportService.PrintPosDataReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("Reports.posReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 26) {
      this.salesReportService.PrintOnlineCompaniesReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("Reports.onlineCompaneis"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 27) {
      this.salesReportService.PrintDialyStockDataReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("Reports.dailystockReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 28) {
      this.salesReportService.PrintCaptainDataReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("Reports.captainReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 29) {
      this.salesReportService.PrintWaiterDataReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("Reports.waiterReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 33) {
      this.salesReportService.PrintCustomerOrdersDataReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("Reports.customerOrdersReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 35) {
      this.salesReportService.PrintProductMovementsDataReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("Reports.ProductMovements"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 36) {
      this.salesReportService.PrintCaptainDetailedDataReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("Reports.captainReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 38) {
      this.salesReportService.PrintInsuranceDataReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("Reports.InsuranceReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 39) {
      this.salesReportService.PrintCustomerOrdersDetailsDataReport(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("Reports.customerOrdersReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 41) {
      this.salesReportService.PrintEmployeeFeeding(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("Reports.employeeFeedingReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    if (this.printflag == 42) {
      this.salesReportService.PrintCustomerComplaint(this.responseobj).subscribe((data: Response) => {
        this.Reportdata = data;
        this.tabs.push({
          title: this.translate.instant("Reports.customercomplaintReport"),
          content: data,
          disabled: false,
          removable: true,
          active: true
        });
      });
    }
    $("#modal-1").modal("hide");
    this.requestStarted = false;
  }
  GetSettings() {
    this.SettingSer.GetSettings().subscribe((res) => {
      this.settings = res as SettingModel;
      this.printDetailobj.LanguageId = this.settings.SystemMainLanguage;
    });
  }
  EditPrintFlagProduct() {
    this.printflag = 4;
  }
  EditPrintFlagOrders() {
    this.printflag = 3;
  }
  editPrintFlag(number : number) {
    this.printflag = number;

  }
  selectTab(tabz: any) {
    let index: number = 0;
    tabz.active = true;
    let container = document.getElementById("container");
    let newReport = document.createElement("div");
    index++;
    newReport.id = `viewer` + index;
    container.appendChild(newReport);
    this.report.loadDocument(tabz.content);
    this.viewer.report = this.report;
    this.viewer.renderHtml(`viewer` + index);
    document.getElementById("viewer" + index).dir = "ltr";
  }
  removeTabHandler(tab: ITab): void {
    this.tabs.splice(this.tabs.indexOf(tab), 1);
    console.log("Remove Tab handler");
  }

  ShowOrderDetails(data: any) {
    let order = this.DeletedOrders.filter((x) => x.DocumentId == data.DocumentId)[0];
    this.OrderDetails = order.OrderDetails;
    $("#modal-5").modal("show");
  }

  PrintCustomerCreditReport(data: any) {
    const format = "dd/MM/yyyy";
    const locale = "en-US";
    let fromdata: string = "";
    let ToDate: string = "";
    let fromtime: string = "";
    let Totime: string = "";
    if (this.responseobj != undefined && this.responseobj.FromDate) {
      fromdata = formatDate(getOnlyDateFromString(this.responseobj.FromDate.toString()), format, locale);
    }
    if (this.responseobj != undefined && this.responseobj.ToDate) {
      ToDate = formatDate(getOnlyDateFromString(this.responseobj.ToDate.toString()), format, locale);
    }
    if (this.responseobj != undefined && this.responseobj.FromTime) {
      fromtime = this.responseobj.FromTime.toString();
    }
    if (this.responseobj != undefined && this.responseobj.ToTime) {
      Totime = this.responseobj.ToTime.toString();
    }

    let UsersName: any = "";
    if (
      this.responseobj.UsersList != undefined &&
      this.responseobj.UsersList != null &&
      this.responseobj.UsersList.length > 0
    ) {
      this.responseobj.UsersList.forEach((item) => {
        UsersName += this.UserList.filter((x) => x.AppUserId == item)[0].UserName;
        let breakname = ",";
        UsersName = UsersName + breakname;
      });
    }
    if (this.printDetailobj.LanguageId == 1) {
      this.myjson = en["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
      this.responseobj.ReportOptions =
        this.responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        this.responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        this.responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        this.responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        this.responseobj.Labels["Users"] +
        ":" +
        UsersName;
    }

    if (this.printDetailobj.LanguageId == 2) {
      this.myjson = ar["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "ar";
      this.responseobj.ReportOptions =
        fromdata +
        ":" +
        this.responseobj.Labels["Fromdate"] +
        "\n" +
        ToDate +
        ":" +
        this.responseobj.Labels["Todate"] +
        "\n" +
        fromtime +
        ":" +
        this.responseobj.Labels["FromTime"] +
        "\n" +
        Totime +
        ":" +
        this.responseobj.Labels["ToTime"] +
        "\n" +
        UsersName +
        ":" +
        this.responseobj.Labels["Users"];
    }
    if (this.printDetailobj.LanguageId == 3) {
      this.myjson = tr["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
      this.responseobj.ReportOptions =
        this.responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        this.responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        this.responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        this.responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        this.responseobj.Labels["Users"] +
        ":" +
        UsersName;
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.myjson = fr["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
      this.responseobj.ReportOptions =
        this.responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        this.responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        this.responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        this.responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        this.responseobj.Labels["Users"] +
        ":" +
        UsersName;
    }
    this.responseobj.CustomerDocumentId = data.CustomerDocumentId;
    this.responseobj.CustomerName = data.Name;
    this.salesReportService.PrintCustomerCreditReport(this.responseobj).subscribe((data: Response) => {
      this.Reportdata = data;
      // localForage.setItem('Reportdata', this.Reportdata);
      // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
      // window.open(link, '_blank');
      this.tabs.push({
        title: this.translate.instant("Printer.CustomerCredit"),
        content: data,
        disabled: false,
        removable: true,
        active: true
      });
    });
  }
  fieldsChange(data: any) {
    let list = [];
    let check = data.currentTarget.checked;
    if (check) {
      this.CreditDataCustomer.forEach((item) => {
        if (item.Remainder > 0) {
          list.push(item);
        }
      });
      this.CreditDataCustomer = list;
      this.Credit.refresh();
    }
  }

  GetTransferdOrders() {
    this.requestStarted = true;
    this.selectSection(22);
    this.showReport = true;
    this.showprint = true;
    this.printflag = 22;
    this.salesReportService.GetTransferdOrders(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.TransferdDetails = res as any;
      const groupedMap = this.TransferdDetails.reduce((acc, item) => {
        if (!acc[item.UUID]) {
          acc[item.UUID] = {
            UUID: item.UUID,
            ProductName: item.ProductName,
            TransferdCount: 0
          };
        }
      
        acc[item.UUID].TransferdCount = item.TransferdCount;
        return acc;
      }, {} as { [uuid: string]: any });
      
      // Convert map to array
      this.TransferdMaster = Object.values(groupedMap);
      
      this.TransferdChild = {
        dataSource: this.TransferdDetails,
        queryString: "UUID",
        allowPaging: true,
        pageSettings: { pageSizes: true, pageSize: 8 },
        columns: [
          { field: "ProductName", headerText: this.translate.instant("Shared.productName") },
          { field: "Creationdate", headerText: this.translate.instant("Reports.TransferdDate") },
          { field: "Creationtime", headerText:  this.translate.instant("Reports.TransferTime") },
          { field: "OrderNumber", headerText:this.translate.instant("Reports.OrderNumber") },
          { field: "OldOrderNumber", headerText: this.translate.instant("Reports.OldOrderNumber") },
          { field: "FromTable", headerText: this.translate.instant("Reports.FromTable") },
          { field: "ToTable", headerText: this.translate.instant("Reports.ToTable")},
          { field: "ProductQuantity", headerText: this.translate.instant("Reports.ProductQuantity") },
          { field: "ProductPrice", headerText: this.translate.instant("Reports.ProductPrice") },
          // { field: "TransferdCount", headerText: this.translate.instant("Reports.TransferdCount") },
          { field: "CreatorUserName", headerText: this.translate.instant("Reports.TransferdBy") }
        ]
      };
    });
  }
  GetDiscountedOrdersReport() {
    this.requestStarted = true;
    this.selectSection(23);
    this.showReport = true;
    this.showprint = true;
    this.printflag = 23;
    this.salesReportService.GetDiscountedOrdersReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.DiscountedOrders = res as any;
    });
  }
  //#region extra expenses
  GetExtraExpensesReport() {
    this.requestStarted = true;
    this.selectSection(24);
    this.showReport = true;
    this.showprint = true;
    this.printflag = 24;
    this.salesReportService.GetExtraExpensesReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.ExtraExpenses = res as any;
      this.extraExpensesResponse.emit({
        ExtraExpenses: this.ExtraExpenses,
        pageSettings: this.pageSettings,
        filterOptions: this.filterOptions,
        toolbarOptions: this.toolbarOptions
      });
    });
  }
  getPosDataReport() {
    this.requestStarted = true;
    this.selectSection(25);
    this.showprint = true;
    this.printflag = 25;

    this.salesReportService.GetPosDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.PointOfSalesData = res as any;
    });
  }
  GetDailyStockDataReport() {
    this.requestStarted = true;
    this.selectSection(27);
    this.showprint = true;
    this.printflag = 27;

    this.salesReportService.GetDailyStockDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.DailyStockData = res as any;
    });
  }
  
  getCaptainDataReport() {
    this.requestStarted = true;
    this.selectSection(28);
    this.showprint = true;
    this.printflag = 28;

    this.salesReportService.GetCaptainDataReport(this.responseobj).subscribe({
      next: (res: any) => {
        this.requestStarted = false;
        this.CaptainsData = res.Captains;
        const gridChild = res.Products;
    
        this.captainChildGrid = {
          dataSource: gridChild,
          queryString: "CaptainDocumentId",
          allowPaging: true,
          pageSettings: { pageSizes: true, pageSize: 8 },
          columns: [
            { field: "ProductName", headerText: "Product Name" },
            { field: "ProductPrice", headerText: "Product Price" },
            { field: "ProductQuantity", headerText: "Product Quantity" },
            { field: "TaxAmount", headerText: "Tax Amount" },
            { field: "DiscountAmount", headerText: "Discount Amount" },
            { field: "NetTotal", headerText: "NetTotal" }
          ]
        };
      },
      error: (err) => {
        this.requestStarted = false;
      }
    });
    
  }
  getWaiterDataReport() {
    this.requestStarted = true;
    this.selectSection(29);
    this.showprint = true;
    this.printflag = 29;

    this.salesReportService.GetWaiterDataReport(this.responseobj).subscribe(
      (res) => {
        this.requestStarted = false;
        this.WaitersData = res as any;
        },
      (error) => {
        this.requestStarted = false;
      }
    );
  }
  getCustomerOrdersDataReport() {
    this.requestStarted = true;
    this.showprint = true;
    if(this.printflag != 39){
      this.selectSection(33);
      this.printflag = 33;
    }
    else{
      this.responseobj.ProcessedEnum = this.responseobj.ProcessedEnum2;
    }

    this.salesReportService.GetCustomerOrdersDataReport(this.responseobj).subscribe(
      (res :any ) => {
        this.requestStarted = false;
        this.CustomerOrdersData = res.customerOrdersList as any;
        this.customerOrdersByDateList = res.customerOrdersByDateList as any;
        const gridChild = res.products as any;
        this.CustomerOrders1ChildGrid = {
          dataSource: gridChild,
          queryString: "ReceivedDate",
          allowPaging: true,
          pageSettings: { pageSizes: true, pageSize: 8 },
          columns: [
            { field: "ProductName", headerText: this.translate.instant("Reports.productName") },
            { field: "ProductQuantity", headerText: this.translate.instant("Reports.ProductQuantity") },
            { field: "ProductPrice", headerText: this.translate.instant("Reports.ProductPrice") },
          ]
        };

        },
      (error) => {
        this.requestStarted = false;
      }
    );
  }
  getTipsDataReport() {
    this.requestStarted = true;
    this.selectSection(34);
    this.showprint = false;
    this.printflag = 34;
    this.salesReportService.getTipsDataReport(this.responseobj).subscribe((res) => {
      this.requestStarted = false;
      this.TipsData = res as any;
    });
  }
  GetProductMovementsDataReport() {
    this.requestStarted = true;
    this.selectSection(35);
    this.showReport = true;
    this.showprint = true;
    this.printflag = 35;
    this.salesReportService.GetProductDataReport(this.responseobj).subscribe(
      (res) => {
        this.requestStarted = false;
        this.ProductMovements = res as any;
        },
      (error) => {
        this.requestStarted = false;
      }
    );
  }
  GetInsuranceDataReport() {
    this.requestStarted = true;
    this.selectSection(38);
    this.showReport = true;
    this.showprint = true;
    this.printflag = 38;
    this.salesReportService.GetInsuranceDataReport(this.responseobj).subscribe(
      (res) => {
        this.requestStarted = false;
        this.InsuranceData = res as any;
        },
      (error) => {
        this.requestStarted = false;
      }
    );
  }

  GetEmployeeFeedingReport() {
    this.requestStarted = true;
    this.selectSection(41);
    this.showReport = true;
    this.showprint = true;
    this.printflag = 41;
    this.salesReportService.GetEmployeeFeedingReport(this.responseobj).subscribe(
      (res) => {
        this.requestStarted = false;
        this.EmployeeFeedingData = res as any;
        },
      (error) => {
        this.requestStarted = false;
      }
    );
  }

   GetCustomerComplaintReport() {
    this.requestStarted = true;
    this.selectSection(42);
    this.showReport = true;
    this.showprint = true;
    this.printflag = 42;
    this.salesReportService.GetCustomerComplaintReport(this.responseobj).subscribe(
      (res) => {
        this.requestStarted = false;
        this.CustomerComplaintData = res as any;
        },
      (error) => {
        this.requestStarted = false;
      }
    );
  }
  
  PrintOnlineCompanyDetailsReport(data: any) {
    const format = "dd/MM/yyyy";
    const locale = "en-US";
    let fromdata: string = "";
    let ToDate: string = "";
    let fromtime: string = "";
    let Totime: string = "";
    if (this.responseobj != undefined && this.responseobj.FromDate != undefined) {
      fromdata = formatDate(this.responseobj.FromDate, format, locale);
    }
    if (this.responseobj != undefined && this.responseobj.ToDate != undefined) {
      ToDate = formatDate(this.responseobj.ToDate, format, locale);
    }
    if (this.responseobj != undefined && this.responseobj.FromTime != undefined) {
      fromtime = this.responseobj.FromTime.toString();
    }
    if (this.responseobj != undefined && this.responseobj.ToTime != undefined) {
      Totime = this.responseobj.ToTime.toString();
    }

    let UsersName: any = "";
    if (
      this.responseobj.UsersList != undefined &&
      this.responseobj.UsersList != null &&
      this.responseobj.UsersList.length > 0
    ) {
      this.responseobj.UsersList.forEach((item) => {
        UsersName += this.UserList.filter((x) => x.AppUserId == item)[0].UserName;
        let breakname = ",";
        UsersName = UsersName + breakname;
      });
    }
    if (this.printDetailobj.LanguageId == 1) {
      this.myjson = en["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
      this.responseobj.ReportOptions =
        this.responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        this.responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        this.responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        this.responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        this.responseobj.Labels["Users"] +
        ":" +
        UsersName;
    }

    if (this.printDetailobj.LanguageId == 2) {
      this.myjson = ar["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "ar";
      this.responseobj.ReportOptions =
        fromdata +
        ":" +
        this.responseobj.Labels["Fromdate"] +
        "\n" +
        ToDate +
        ":" +
        this.responseobj.Labels["Todate"] +
        "\n" +
        fromtime +
        ":" +
        this.responseobj.Labels["FromTime"] +
        "\n" +
        Totime +
        ":" +
        this.responseobj.Labels["ToTime"] +
        "\n" +
        UsersName +
        ":" +
        this.responseobj.Labels["Users"];
    }
    if (this.printDetailobj.LanguageId == 3) {
      this.myjson = tr["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
      this.responseobj.ReportOptions =
        this.responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        this.responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        this.responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        this.responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        this.responseobj.Labels["Users"] +
        ":" +
        UsersName;
    }
    if (this.printDetailobj.LanguageId == 4) {
      this.myjson = fr["Reports"];
      this.responseobj.Labels = this.myjson;
      this.responseobj.CurrentLang = "en";
      this.responseobj.ReportOptions =
        this.responseobj.Labels["Fromdate"] +
        ":" +
        fromdata +
        "\n" +
        this.responseobj.Labels["Todate"] +
        ":" +
        ToDate +
        "\n" +
        this.responseobj.Labels["FromTime"] +
        ":" +
        fromtime +
        "\n" +
        this.responseobj.Labels["ToTime"] +
        ":" +
        Totime +
        "\n" +
        this.responseobj.Labels["Users"] +
        ":" +
        UsersName;
    }
    this.responseobj.CustomerDocumentId = data.CustomerDocumentId;
    this.responseobj.CustomerName = data.Name;
    this.salesReportService.PrintOnlineCompanyDetailsReport(this.responseobj).subscribe((data: Response) => {
      this.Reportdata = data;
      // localForage.setItem('Reportdata', this.Reportdata);
      // const link = this.router.serializeUrl(this.router.createUrlTree(['/viewReport']));
      // window.open(link, '_blank');
      this.tabs.push({
        title: this.translate.instant("Printer.CustomerCredit"),
        content: data,
        disabled: false,
        removable: true,
        active: true
      });
    });
  }
  PrintCustomerOrdersDetailsReport(data: any) {
    this.requestStarted = true;
    this.model = [];
    this.salesReportService.prepareDetailsReportLables(this.printDetailobj,this.model,data.DocumentId,this.myjson,this.ifPerview);
    this.customerOrderService.print(this.model).subscribe((res: Response) => {
      this.requestStarted = false;
      this.loading = false;
      this.reprtresult = res;

      this.report.loadDocument(this.reprtresult);
        // Render report
        this.report.renderAsync();

        // Create an HTML settings instance. You can change export settings.
        var settings = new Stimulsoft.Report.Export.StiHtmlExportSettings();
        // Create an HTML service instance.
        var service = new Stimulsoft.Report.Export.StiHtmlExportService();
        // Create a text writer objects.
        var textWriter = new Stimulsoft.System.IO.TextWriter();
        var htmlTextWriter = new Stimulsoft.Report.Export.StiHtmlTextWriter(textWriter);
        // Export HTML using text writer.
        service.exportTo(this.report, htmlTextWriter, settings);
        //  var contents =(<HTMLInputElement>document.getElementById("FrameDIv")).innerHTML;
        var frame1 = document.createElement("iframe");
        frame1.name = "frame1";
        frame1.style.position = "absolute";
        frame1.style.top = "-1000000px";
        document.body.appendChild(frame1);
        document.dir = "ltr";
        var frameDoc =
          (<HTMLIFrameElement>frame1).contentDocument || (<HTMLIFrameElement>frame1).contentWindow.document;
        frameDoc.open();
        frameDoc.write("</head><body>");
        frameDoc.write(textWriter.getStringBuilder().toString());
        frameDoc.write("</body></html>");
        frameDoc.close();
        setTimeout(function () {
          window.frames["frame1"].focus();
          window.frames["frame1"].print();
          document.body.removeChild(frame1);
        }, 500);
        return false;
      },
      (err) => {
        this.requestStarted = false;
      }
    );
    this.ifPerview = false;
    return false;
  }

  filterCustomers(searchterm?: any , UseCredit?:boolean) {
    let model: CustomerModel = new CustomerModel();
    if (searchterm?.text?.length >= 3) {
      //search by phone
      if (Number(searchterm?.text) > 0)
        model.Phone = searchterm?.text;
        //search by name
      else
        model.Name = searchterm?.text;

      if(UseCredit) model.UseCredit = true;
      this.orderSer.GetCustomerByMobileOrName(model).subscribe((res) => {
        this.customers = res as CustomerModel[];
      });
    }
  }
  selectSection(printflag? : number) {
    this.processeds = [
      { DocumentId: 0, Name: this.translate.instant("Reports.All") },
      { DocumentId: 1, Name: this.translate.instant("Reports.Processed") },
      { DocumentId: 2, Name: this.translate.instant("Reports.UnProcessed") }
    ];
    this.sections?.forEach(x=> {
      if( x.modelBinding == "CustomerDocumentId" && printflag && (printflag == 15 || printflag == 9 || printflag == 33 ) ){
        this.responseobj.CustomerDocumentId = this.responseobj.CustomerDocumentId;
      }
      else if(x.modelBinding == "ProductGroupsDocumentIdList" && printflag && (printflag == 4 || printflag == 3)  ){
        this.responseobj.ProductGroupsDocumentIdList = this.responseobj.ProductGroupsDocumentIdList;
      }
      else if(x.modelBinding == "ProductDocumentIdList" && printflag && (printflag == 35 || printflag == 2)  ){
        this.responseobj.ProductDocumentIdList = this.responseobj.ProductDocumentIdList;
      }
      else if(printflag && printflag == x.printflag ){
        // keep the value 
      }
      else
        this.responseobj[x.modelBinding] = undefined;
    })
  }
  getReportTranslationObj(orderobj: any) {
      let lang1, lang2;
      if (this.settings.CustomerReceiptReportLanguage1 > 0)
        lang1 = this.getJsonLang(this.settings.CustomerReceiptReportLanguage1);
      if (this.settings.CustomerReceiptReportLanguage2 > 0)
        lang2 = this.getJsonLang(this.settings.CustomerReceiptReportLanguage2);
      let keys = Object.keys(ar["Reports"]);
      let finalLang = deepCopy(ar["Reports"]);
  
      keys.forEach((key) => {
        if (lang1) finalLang[key] = lang1[key];
        if (lang2) finalLang[key] += "\n" + lang2[key];
      });
      let Direction = "ar";
      // Change to Left to Right Because default report is rigth to left
      if (this.settings.ReportDirection == 1) Direction = "ar";
      if (this.settings.ReportDirection == 2) Direction = "en";
      let LanguageOptions = {
        CurrentUserLang: Direction,
        ReportsJson: finalLang
      };
      orderobj.LanguageOptions = LanguageOptions;
      return orderobj;
    }
  //#endregion

  // closePrint() {
  //   $("#modal-1").modal("hide");
  //   this._ExtraExpensesService.openExtraExpenses.next(true);
  // }

  // @Input() extraExpensesResponse: any;
}
