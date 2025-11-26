import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { OrderService } from "../core/Services/Transactions/order.service";
import { IntegrationService } from "../core/Services/Transactions/integration.service";
import { PointOfSalesService } from "../core/Services/Transactions/pointofsales.service";
import { PointOfSaleModel, ToastrService } from "../Features/point-of-sale/pointofsaleimports";
import { LocalstorgeService } from "../localstorge.service";
import { DashboardService } from "../core/Services/Transactions/dashboard.service";
import { forkJoin } from "rxjs";

@Component({
  selector: "app-received-orders-notification",
  templateUrl: "./received-orders-notification.component.html",
  styleUrls: ["./received-orders-notification.component.scss"]
})
export class ReceivedOrdersNotificationComponent implements OnInit {
  intervalOfNotification?: any;
  allYemekOrdersLength: number;
  authorizedPOS: PointOfSaleModel = new PointOfSaleModel();
  mobileOrdersCount: number;
  callCenterOrdersCount: number;
  currentLang: string;
  integrationListLength: number;

  constructor(
    private router: Router,
    private _OrderService: OrderService,
    private _IntegrationService: IntegrationService,
    private _PointOfSalesService: PointOfSalesService,
    private LocalstorgeService: LocalstorgeService,
    private _DashboardService: DashboardService,
    private _ActivatedRoue: ActivatedRoute,
    public toastr: ToastrService
  ) {
    this.currentLang = this.LocalstorgeService.get("langs") === "en" ? "en" : "ar";

    if (this._ActivatedRoue.snapshot["_routerState"].url == "/order") {
      this.stopInterval();
    } else {
      this.startInterval();
    }
  }

  ngOnInit() {
    this.getAllBackendRequests();
  }

  stopInterval() {
    clearInterval(this.intervalOfNotification);
    this.mobileOrdersCount = 0;
    this.callCenterOrdersCount = 0;
    this.allYemekOrdersLength = 0;
    this.intervalOfNotification = undefined;
  }

  startInterval() {
    if (
      this.intervalOfNotification ||
      !this.authorizedPOS ||
      !this.authorizedPOS.ReceiveCallCenter ||
      !this.authorizedPOS.LinkWithOnlineOrder
    )
      return;

    this.intervalOfNotification = setInterval(() => {
      if (this.integrationListLength) {
        this._IntegrationService.GetAllMessages().subscribe({
          next: (res: any) => {
            this.allYemekOrdersLength = res.length;
            if (this.allYemekOrdersLength > 0) {
              const audio = new Audio("/../../../../assets/Config/song.mp3");
              audio.play();
            }
          }
        });
      }
      if (this.authorizedPOS.ReceiveCallCenter || this.authorizedPOS.LinkWithOnlineOrder) {
        this._OrderService.GetMobileOrdersCount(this.authorizedPOS).subscribe({
          next: (res: any) => {
            this.mobileOrdersCount = res["Item2"];
            this.callCenterOrdersCount = res["Item3"];
            if (this.mobileOrdersCount > 0 || this.callCenterOrdersCount > 0) {
              const audio = new Audio("/../../../../assets/Config/song.mp3");
              audio.play();
            }
          }
        });
      }
    }, 60000);
  }

  gotToOrders() {
    if (this._DashboardService.isOpenShift && !this._DashboardService.isClosedShift) {
      this.router.navigate(["/order"]);
    } else {
      this.toastr.warning("Shift is not opened yet!");
      return;
    }
  }

  getAllBackendRequests() {
    const requests = [
      this._DashboardService.checkUnclosedShiftfromUser(),
      this._IntegrationService.GetMobileIntegrationSettings(),
      this._PointOfSalesService.getAuthorizedPOS()
    ];

    const subsciptions = forkJoin(requests).subscribe({
      next: (results: any) => {
        this._DashboardService.isOpenShift = results[0]["checkModel"].IsOpenShift;
        this._DashboardService.isClosedShift = results[0]["checkModel"].IsClosedShift;

        this.integrationListLength = results[1];

        this.authorizedPOS = results[2];
      },
      complete: () => {
        this.startInterval();
      }
    });
  }
}
