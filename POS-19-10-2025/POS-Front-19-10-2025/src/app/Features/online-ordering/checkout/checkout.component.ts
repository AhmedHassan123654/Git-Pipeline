import { Component, HostListener, OnInit, ViewChild } from "@angular/core";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { AppService } from "src/app/core/Services/app.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { OrderModel } from "../../manage-order/manageorderimport";
import { CommonService, Router, ActivatedRoute, ToastrService } from "../../branch/branchimport";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.scss"]
})
export class CheckoutComponent implements OnInit {
  innerWidth: any;
  openMainMenu: boolean = true;
  openSide: boolean;
  orderCompleted: boolean = false;
  clickedInCashier: boolean = true;
  public step = 1;
  public sort: string = "";
  favoriteSeason: string;
  seasons: string[] = ["In Cashier"];
  // seasons: string[] = ['In Cashier', 'OnLine Payment'];
  public checkoutForm: FormGroup = new FormGroup({});
  public sidenavOpen: boolean = true;
  public showSidenavToggle: boolean = false;
  [key: string]: any;
  @ViewChild("sidenav") sidenav: any;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  constructor(
    public appService: AppService,
    private fb: FormBuilder,
    public orderSer: OrderService,
    private common: CommonService,
    public router: Router,
    private route: ActivatedRoute,
    public toastr: ToastrService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.TableDocumentId = params.TableDocumentId;
      this.CustomerDocumentId = params.CustomerDocumentId;
    });
    this.defaultIm = "assets/images/v10.jpg";
    this.imgURL = this.common.rooturl.replace("api", "") + "StaticFiles/Images/Products/";
  }
  routTo(route: string) {
    this.router.navigateByUrl("/" + route + "?TableDocumentId=" + this.TableDocumentId);
  }
  ngOnInit(): void {
    if (
      !this.appService.orderobj ||
      !this.appService.orderobj.OrderDetails ||
      this.appService.orderobj.OrderDetails.length == 0
    ) {
      this.toastr.warning("proceed to checkout you must add some items to your shopping cart!");
      this.routTo("firstHome");
    }
    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    }
    this.checkoutForm = this.fb.group({
      paymentMethod: this.fb.group({
        cardHolderName: [null, Validators.required],
        cardNumber: [null, Validators.required],
        expiredMonth: [null],
        expiredYear: [null],
        cvv: [null, Validators.compose([Validators.required, Validators.minLength(3)])]
      })
    });
  }
  @HostListener("window:resize", ["$event"])
  onResize(event?) {
    this.innerWidth = window.innerWidth;

    if (this.innerWidth < 992) {
      this.openSide = true;
      this.sidenavOpen = false;
      this.openMainMenu = false;
      this.showSidenavToggle = true;
      // this.sidenav.open();
    } else {
      this.showSidenavToggle = false;
      this.openSide = false;
      this.openMainMenu = true;
      this.sidenavOpen = true;
      // this.sidenav.close();
    }
  }
  public setStep(index: number) {
    this.step = index;
  }
  public nextStep() {
    this.step++;
  }
  public prevStep() {
    this.step--;
  }
  public async placeOrder() {
    await this.closeAsync();
    this.step = 2;
    this.orderCompleted = true;
    this.appService.orderobj = new OrderModel();
    this.appService.orderobj.OrderDetails = [];
    // this.appService.Data.cartList.length = 0;
    // this.appService.Data.totalPrice = 0;
    // this.appService.Data.totalCartCount = 0;
  }
  closeAsync() {
    return new Promise((resolve) => {
      this.requestStarted = true;
      this.orderSer.CloseMobileOrder(this.appService.orderobj).subscribe(async (res) => {
        resolve(res);
        this.requestStarted = false;
      });
    });
  }
  public onSubmitForm(form: any) {
    if (this.checkoutForm.get(form)?.valid) {
      this.nextStep();
      this.placeOrder();
    }
    if (this.clickedInCashier) {
      this.placeOrder();
    }
  }
  clickedInCashierFun(value?) {
    // if(value ==this.seasons[0]){
    //   this.clickedInCashier = true;
    // }
  }
}
