import { Component, OnInit } from "@angular/core";
import { DashboardService } from "src/app/core/Services/Transactions/dashboard.service";
import { PointOfSaleModel } from "src/app/core/Models/Transactions/point-of-sale-model";
import { IncomingUserModel } from "src/app/core/Models/Transactions/incoming-user-model";
import { HandlingBackMessages } from "src/app/core/Helper/handling-back-messages";
import { ToastrService } from "ngx-toastr";
import Keyboard from "simple-keyboard";
import { Router } from "@angular/router";
import { CommonService } from "src/app/core/Services/Common/common.service";
import { LanguageSerService } from "src/app/core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
declare var $: any;
@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  public primaryXAxis: Object;
  public columnData: Object[];
  public lineData: Object[];
  public title: string;
  public primaryYAxis: Object;
  public chartArea: Object;
  public marker: Object;
  public dragSettings: Object;
  public tooltip: Object;
  language: string;

  // Charts
  public chartData: any = [];
  public legendSettings: Object;
  defaultIm: string;
  CheckedDisabled: boolean = false;
  DisabledShiftOpenClass: boolean = false;
  pointofsaleobj: PointOfSaleModel = new PointOfSaleModel();
  incominguserobj: IncomingUserModel = new IncomingUserModel();
  bestSeller: any;
  stoppedProducts: any = {};
  promos: any = {};
  Keyboardnum: Keyboard;
  Showing: boolean = false;
  Showing3: boolean = false;
  Showing2: boolean = false;
  imgURL: any = "";
  comboboxusersfields: Object = {};

  result: any = {
    IsOpenShift: false,
    IsClosedShift: false,
    IncomingUser: {}
  };

  selectedInput = "";
  users: any;
  constructor(
    private dashboardSer: DashboardService,
    private errorMessage: HandlingBackMessages,
    private toastr: ToastrService,
    private router: Router,
    private common: CommonService,
    private languageSerService: LanguageSerService,
    private translate: TranslateService
  ) {
    this.comboboxusersfields = { text: "UserName", value: "AppUserId" };
    this.defaultIm = "assets/images/defaultDashboard.jpg";
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
  }

  ngOnInit() {
    this.firstOpen();
    this.checkOpenDay();
    this.getBestSellerProducts();
    // this.getStoppedProducts();
    this.getAllPromos();
  }

  getAllPromos() {
    this.dashboardSer.getAllPromos().subscribe(
      (res: any) => {
        this.promos = res;
      },
      (err) => {}
    );
  }
  firstOpen() {
    this.imgURL = this.common.rooturl.replace("api", "") + "StaticFiles/Images/Products/";
    this.dashboardSer.FirstOpen().subscribe((res) => {
      this.pointofsaleobj = res as PointOfSaleModel;
      // this.CheckedDisabled = true;
      this.incominguserobj.OpenBalance = 0;
    });
  }
  getStoppedProducts() {
    this.dashboardSer.getStoppedProducts().subscribe(
      (res: any) => {
        this.stoppedProducts = res;
      },
      (err) => {}
    );
  }
  getBestSellerProducts() {
    this.dashboardSer.getBestSellerProducts().subscribe(
      (res: any) => {
        this.bestSeller = res;

        //#region Charts

        for (let i = 0; i < this.bestSeller.length; i++) {
          let data = {
            x: this.bestSeller[i].Name,
            y: this.bestSeller[i].Count
          };
          this.chartData.push(data);
        }
        this.primaryXAxis = {
          title: "Products",
          valueType: "Category",
          labelIntersectAction: "Rotate45",
          minimum: -0.3,
          maximum: this.bestSeller.length,
          labelPlacement: "OnTicks",
          majorGridLines: { width: 0 }
        };
        this.primaryYAxis = {
          minimum: 0,
          maximum: Math.max.apply(
            null,
            this.bestSeller.map((x) => x.Count)
          ),
          interval:
            Math.min.apply(
              null,
              this.bestSeller.map((x) => x.Count)
            ) > 0
              ? Math.min.apply(
                  null,
                  this.bestSeller.map((x) => x.Count)
                )
              : 1,
          title: "Sold Items Count"
        };
        this.title = "Products Graph";

        //#endregion
      },
      (err) => {
        this.toastr.error(this.errorMessage.GlobalMessages(err), "getBestSellerProducts");
      }
    );
  }
  checkOpenDay() {
    this.dashboardSer.checkUnclosedShiftfromUser().subscribe((res) => {
      this.result = res;
      if (this.result.IsOpenShift === true) {
        this.DisabledShiftOpenClass = true;
        this.CheckedDisabled = false;
        this.incominguserobj = this.result.IncomingUser;
      }
      if (this.result.IsClosedShift === true) {
        this.CheckedDisabled = true;
        this.DisabledShiftOpenClass = false;
        this.incominguserobj = new IncomingUserModel();
      } else if (this.result.IsClosedShift === false && this.result.IsOpenShift === false) {
        this.CheckedDisabled = true;
        this.DisabledShiftOpenClass = false;
        this.incominguserobj = new IncomingUserModel();
      }
      this.dashboardSer.getAllUsersInfo().subscribe((res: any) => {
        this.users = res;
      });
    });
  }
  RedirectTo(Rout: string) {
    this.router.navigateByUrl("/" + Rout);
  }
  openShift() {
    this.incominguserobj.PointOfSaleId = this.pointofsaleobj.Id;
    this.dashboardSer.OpenDay(this.incominguserobj).subscribe(
      (res: any) => {
        this.errorMessage.GlobalMessages(res);
        if (res == 1) {
          $("#openshiftmodal").modal("hide");
          this.checkOpenDay();
        }
      },
      (err) => {
        this.toastr.error(this.errorMessage.GlobalMessages(err), "Open Shift");
      }
    );
  }
  endShift() {
    this.incominguserobj.PointOfSaleId = this.pointofsaleobj.Id;
    if (!this.incominguserobj.ReceivedUserPin) {
      this.toastr.error("Enter your pin");
      return false;
    }
    var user = this.users.filter((x) => x.AppUserId == this.incominguserobj.ReceivedUserId)[0];
    if (user.Pin != this.incominguserobj.ReceivedUserPin) {
      this.toastr.error("Wrong pin");
      return false;
    }

    this.dashboardSer.OpenDay(this.incominguserobj).subscribe(
      (res: any) => {
        this.errorMessage.GlobalMessages(res);
        if (res == 1) {
          $("#modal-420111024").modal("hide");
          $("#endshiftmodal").modal("hide");
          this.checkOpenDay();
        }
      },
      (err) => {
        this.toastr.error(this.errorMessage.GlobalMessages(err), "Open Shift");
      }
    );
  }
  onUserChanged(event) {
    // this.incominguserobj.ReceivedUserId = event.itemData.AppUserId;
  }
  /******Keyboard function********/

  openkeyboard() {
    this.Showing = true;
    this.Showing2 = true;
    this.Showing3 = true;
  }
  closekeyboard() {
    this.Showing = false;
    this.Showing2 = false;
    this.Showing3 = false;
  }
  ngAfterViewInit() {
    //$("#preloader-wrap").addClass("loaded");
    this.Keyboardnum = new Keyboard({
      onChange: (input) => this.onChange(input),
      onKeyPress: (button) => this.onKeyPress(button),
      layout: {
        default: ["1 2 3", "4 5 6", "7 8 9", ". 0 {bksp}"]
      },
      theme: "hg-theme-default hg-layout-numeric numeric-theme",
      display: {
        "{bksp}": '<i class="fas fa-backspace"></i>'
      },

      preventMouseDownDefault: true
    });
  }

  onInputFocus = (event: any) => {
    this.openkeyboard();
    this.selectedInput = event.target.id;

    this.Keyboardnum.setOptions({
      inputName: event.target.id
    });
  };

  onChange = (input: string) => {
    if (this.selectedInput == "openbalance_id") {
      this.incominguserobj.OpenBalance = Number(input);
    }
  };

  onKeyPress = (button: string) => {
    /**
     * If you want to handle the shift and caps lock buttons
     */
    if (button === "{shift}" || button === "{lock}") this.handleShift();
  };

  onInputChange = (event: any) => {
    this.Keyboardnum.setInput(event.target.value, event.target.id);
  };

  handleShift = () => {
    let currentLayout = this.Keyboardnum.options.layoutName;
    let shiftToggle = currentLayout === "default" ? "shift" : "default";
    this.Keyboardnum.setOptions({
      layoutName: shiftToggle
    });
  };
}
