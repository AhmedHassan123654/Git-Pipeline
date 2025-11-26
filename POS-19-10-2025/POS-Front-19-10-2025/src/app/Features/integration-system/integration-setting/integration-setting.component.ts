import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { ToastrService } from "ngx-toastr";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { general, HandlingBackMessages, IntegrationSettingService, quickAction } from "../integration-setting-import";
import { OrderPayTypeModel } from "../../../core/Models/Transactions/order-pay-type-model";
import { PointOfSaleModel } from "../../point-of-sale/pointofsaleimports";
import { ServerSyncService } from "src/app/core/Services/Authentication/server-sync.service";

@Component({
  selector: "app-integration-setting",
  templateUrl: "./integration-setting.component.html",
  styleUrls: ["./integration-setting.component.scss"]
})
export class IntegrationSettingComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;

  openText = JSON.stringify("Open");
  closeText = JSON.stringify("Closed");

  responseobj?: any;
  restaurantStatus?: boolean;
  restaurantStatusError?: boolean;

  paymentTypes: OrderPayTypeModel[] = [];

  @ViewChild("frmRef") frmRef;
  public Flds = { text: "Name", value: "Id" };
  public Flld = { text: "Name", value: "DocumentId" };

  public IntegrationSystemsList = [
    { Name: "YemekSepeti", Id: 1 },
    { Name: "GetirYemek", Id: 2 },
    { Name: "TrendYolYemek", Id: 3 },
    { Name: "Deliverect", Id: 4 }
  ];

  // Special fields for integrations
  // All fields required by default. You should make required property false in order to make it optional.
  public fields: { [key: number]: Array<{ label: string; name: string; required?: boolean }> } = {
    1: [
      // Yemek sepeti fields
      { label: "Shared.URL", name: "URL" },
      { label: "Shared.UserName", name: "UserName" },
      { label: "Shared.Password", name: "Password" },
      { label: "Shared.CatalogName", name: "CatalogName" },
      { label: "Shared.CategoriId", name: "CategoriId" }
    ],
    2: [
      // Getir yemek fields
      { label: "Shared.URL", name: "URL" },
      { label: "Shared.ApiSecretKey", name: "ApiSecretKey" },
      { label: "Shared.RestaurantKey", name: "RestaurantSecretKey" },
      { label: "Shared.ClientId", name: "ClientId", required: false }, // v2
      { label: "Shared.ClientSecret", name: "ClientSecret", required: false } // v2
    ],
    3: [
      // Trendyol yemek fields
      { label: "Shared.URL", name: "URL" },
      { label: "Shared.SupplierId", name: "SupplierId" },
      { label: "Shared.StoreId", name: "StoreId" },
      { label: "Shared.ApiKey", name: "ApiSecretKey" },
      { label: "Shared.ApiSecret", name: "RestaurantSecretKey" },
      { label: "Shared.Token", name: "Token", required: false } // v2
    ]
  };

  //#endregion

  constructor(
    public IntegrationSettingSer: IntegrationSettingService,
    public router: Router,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages,
    private languageSerService: LanguageSerService,
    private translate: TranslateService,
    private serverSyncService: ServerSyncService
  ) {
    super();
    this.initializeobjects();
  }

  //#region Angular Life Cycle

  ngOnInit(): void {
    this.scrFirstOpen().subscribe(() => {
      this.responseobj.screenPermission.Print = false;
      this.responseobj.CustomerList = this.responseobj.CustomerList.filter(((x)=> x.OnlineCompany == true))
      this.allCustomers = this.responseobj.CustomerList;
      this.paymentTypes = this.responseobj.OrderPayTypes;
      // Object to view loaded, and we will get restaurant status if any data available
      this.getRestaurantStatus();
      // console.log("ana hena");

      this.openText = JSON.stringify(this.translate.instant("Shared.Open"));
      this.closeText = JSON.stringify(this.translate.instant("Shared.Closed"));
    });
  }

  //#endregion
  //#region PricingClasses Methods

  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.IntegrationSettingSer;
    this.request = this.router.getCurrentNavigation().extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  //#endregion
  //#region OperationMenu

  quickEvents(event: quickAction): void {
    switch (event) {
      case quickAction.afterNew:
        this.afterNew({});
        this.enableChiled = true;
        break;
      case quickAction.afterAdd:
        this.afterAdd();
        this.enableChiled = false;
        break;
      case quickAction.beforeAdd:

        break;
      case quickAction.afterModify:
        this.afterModify();
        this.enableChiled = true;
        break;
      case quickAction.afterUndo:
        this.enableChiled = false;
        break;
    }
  }

  //#endregion

  //#region Pagger

  afterPag(event: any): void {
    this.formPaging({ formObj: event });
    this.getRestaurantStatus();
  }

  /*  getIntegrationSystems(){
    this.IntegrationSettingSer.GetIntegrationSystems().subscribe(
      res=>{
       // this.IntegrationSystemsList=[];
        this.IntegrationSystemsList = res as any;


      },
    );
      } */
  pullProdutsFromServer() {
    this.IntegrationSettingSer.pullProdutFromServer(this.responseobj.DocumentId).subscribe((res) => {
      if (res == true) this.toastr.success(this.toastrMessage.GlobalMessages(res));
    });
  }

  pullPaymentsFromServer() {
    this.IntegrationSettingSer.pullPaymentFromServer(this.responseobj.DocumentId).subscribe((res) => {
      if (res == true) this.toastr.success(this.toastrMessage.GlobalMessages(res));
    });
  }

  getRestaurantStatus() {
    this.restaurantStatusError = false;
    if (this.responseobj && (this.responseobj.Integration === 2 || this.responseobj.Integration === 3)) {
      this.IntegrationSettingSer.getRestaurantStatus(this.responseobj.Integration).subscribe({
        next: (status: boolean) => {
          this.restaurantStatus = status;
          this.restaurantStatusError = false;
        },
        error: (err: any) => {
          this.restaurantStatusError = true;
        }
      });
    }
  }

  changeRestaurantState(status: boolean) {
    this.IntegrationSettingSer.updateRestaurantStatus(this.responseobj.Integration, status).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant("Shared.RestaurantStatusUpdated"));
        this.restaurantStatus = status;
      },
      error: (err: any) => {
        this.toastr.error(this.translate.instant("Shared.RestaurantStatusCannotUpdate"));
      }
    });
  }

  setCommission(customerDocumentId: string) {
    const customer = this.allCustomers.find((x) => x.DocumentId == customerDocumentId);
    if (customer && customer.IntegrationCommission) this.responseobj.Commission = customer.IntegrationCommission;
    else this.responseobj.Commission = 0;
  }

  toggleRestaurantStatus() {
    this.restaurantStatus = !this.restaurantStatus;

    this.changeRestaurantState(this.restaurantStatus);
  }

  pushToServer() {
    const pos = new PointOfSaleModel();
    this.start = true;
    this.serverSyncService.pushInputsToOnlineOrder(pos).subscribe({
        complete: () => {
            this.toastr.success(this.toastrMessage.GlobalMessages(1), "ServerSync");
            this.start = false;
        },
        error: (err: any) => {
            this.toastr.error(this.toastrMessage.GlobalMessages(err), "ServerSync");
        }
    });
  }
}
