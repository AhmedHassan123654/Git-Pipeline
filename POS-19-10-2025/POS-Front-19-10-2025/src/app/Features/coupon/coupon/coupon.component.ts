import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { general, LanguageSerService, quickAction, ToastrService } from "../../adminstration/permission-imports";
import { CouponService } from "src/app/core/Services/Transactions/coupon.service";
import { OrderService } from "../../follow-call-center-order/follow-call-center-order-imports";

@Component({
  selector: "app-coupon",
  templateUrl: "./coupon.component.html",
  styleUrls: ["./coupon.component.scss"]
})
export class CouponComponent extends general implements OnInit {
  //#region Declartions
  [key: string]: any;
  @ViewChild("frmRef") frmRef;
  public Flds = { text: "Name", value: "Id" };
  public FldDocumentId = { text: "Name", value: "DocumentId" };
  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  randomString: string;
  isGenerating: boolean = false;
  selectedProductDocumentId :any;
  // countPerCouponShow: boolean = false;
  // countPerCustomerShow: boolean = false;
  ValueTypesEnum = [];
  minDate: Date = new Date(); // Set the minimum date to the current date
  //#endregion
  constructor(
    public couponSer: CouponService,
    public orderSer: OrderService,
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
    this.couponsFirstOpenAsync();
  }

  couponsFirstOpenAsync() {
    this.couponSer.CouponsFirstOpenAsync().subscribe((res: any) => {
      this.CustomerGroups = res.CustomerGroups;
      this.products = res.products;
      this.firstOpen();
    });
  }

  firstOpen() {
    this.scrFirstOpen().subscribe(() => {
      if(!this.responseobj.UseRations){
        this.ValueTypesEnum = [
          { Id: 1, Name: this.translate.instant("Shared.Percentage") },
          { Id: 2, Name: this.translate.instant("Shared.value") }
        ];
      }
      else{
        this.ValueTypesEnum = [
          { Id: 1, Name: this.translate.instant("Shared.Percentage") }
        ];
      }
      if (this.request.currentAction == "Add") {
      }
      if (this.request.currentAction == "Edit") {
        this.disabledflag = true;
      }
    });
  }
  //#region OperationMenu
  quickEvents(event: quickAction): void {
    switch (event) {
      case quickAction.afterNew:
        this.enableChiled = true;
        // this.countPerCouponShow = true;
        // this.countPerCustomerShow = false;
        break;
      case quickAction.beforeNew:
        // this.countPerCouponShow = true;
        // this.countPerCustomerShow = false;
        break;
      case quickAction.beforeAdd:
        this.checkZeroCount();
        break;
      case quickAction.afterAdd:
        this.enableChiled = false;
        this.firstOpen();
        break;
      case quickAction.beforeUpdate:
        this.checkZeroCount();
        break;
      case quickAction.afterModify:
        this.enableChiled = true;
        break;
      case quickAction.afterUndo:
        this.enableChiled = false;
        break;
    }
    this.setValueTypesEnum();
  }
  //#endregion
  //#region Pagger

  checkZeroCount() {
    if (this.responseobj.UseCountPerCustomer <= 0 && (this.responseobj?.CustomerGroups?.length || this.responseobj.UseRations)) {
      this.toastr.warning(this.translate.instant("messages.countnumbershouldbegreaterthan0"));
      this.frmRef.form.setErrors({ invalid: true });
    }
    if (
      this.responseobj.UseCountPerCoupon <= 0 && !this.responseobj.UseRations && !this.responseobj?.CustomerGroups?.length) {
      this.toastr.warning(this.translate.instant("messages.countnumbershouldbegreaterthan0"));
      this.frmRef.form.setErrors({ invalid: true });
    }
  }
  initializeobjects(): void {
    this.responseobj = {};
    this.service = this.couponSer;
    this.request = this.router.getCurrentNavigation()?.extras as unknown;
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  //#region Pagger
  afterPag(event: unknown): void {
    this.formPaging({ formObj: event });
    this.setValueTypesEnum();
  }

  //#endregion
  generateRandomString() {
    // Check if the generation is already in progress
    if (this.isGenerating) {
      return;
    }
    this.isGenerating = true;
    const length = 6;
    let result = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * this.characters.length);
      result += this.characters[randomIndex];
    }
    // Simulate an asynchronous operation to demonstrate throttling
    setTimeout(() => {
      this.responseobj.Code = result;
      this.isGenerating = false;
    }, 100); // Add a delay to simulate a more realistic scenario

    // You can remove the setTimeout and directly assign the randomString value
    // if you don't need the delay and want immediate assignment.
  }
  disableCountsInputs() {
    if (this.responseobj?.CustomerGroups?.length > 0) {
      // this.countPerCouponShow = false;
      // this.countPerCustomerShow = true;
      this.responseobj.UseCountPerCoupon = 0;
    } else {
      // this.countPerCouponShow = true;
      // this.countPerCustomerShow = false;
      this.responseobj.UseCountPerCustomer = 0;
    }
  }
  // SelectProducts(productList: any){
  //   this.responseobj.ProductsIds = [];
  //   this.responseobj.ProductsIds = productList;
  // }
  setValueTypesEnum() {
    this.ValueTypesEnum = [];
    if (!this.responseobj?.UseRations && !this.responseobj?.ProductsIds?.length) {
      this.ValueTypesEnum = [
        { Id: 1, Name: this.translate.instant("Shared.Percentage") },
        { Id: 2, Name: this.translate.instant("Shared.value") }
      ];
    } else {
      this.ValueTypesEnum = [
        { Id: 1, Name: this.translate.instant("Shared.Percentage") }
      ];
      this.responseobj.DiscountType = 1;
    }
  }

  onDiscountTypeChange(){
    this.responseobj.Value = 0;
  }
}
