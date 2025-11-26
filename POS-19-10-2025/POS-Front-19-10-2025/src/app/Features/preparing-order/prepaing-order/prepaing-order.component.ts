import { ChangeDetectionStrategy,ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PraparingAndReadingOrdersService } from "src/app/core/Services/Transactions/praparing-and-reading-orders.service";
import Swal from "sweetalert2";
import { LanguageSerService, SettingService } from "../../adminstration/permission-imports";
import { deepCopy } from "src/app/core/Helper/objectHelper";
declare let $: any;
@Component({
  selector: "app-prepaing-order",
  templateUrl: "./prepaing-order.component.html",
  styleUrls: ["./prepaing-order.component.scss"],
  changeDetection:ChangeDetectionStrategy.OnPush
})
export class PrepaingOrderComponent implements OnInit {
  [key: string]: any;
  CurrentOrder: any = {};
  constructor(
    public PreparingSer: PraparingAndReadingOrdersService,
    public settingSer:SettingService,
    public translate: TranslateService,
    public languageSerService: LanguageSerService,
    private cdr: ChangeDetectorRef,
    
  ) {
    this.languageSerService.currentLang.subscribe((lan) => this.translate.use(lan));
  }

  ngOnInit(): void {
    this.GetPreparingOrders();
    this.GetReadyOrders();
    this.settingSer.GetSetting().subscribe((res) => {
        this.settingobj = res;
    });
    this.interval = setInterval(() => {
      this.GetPreparingOrders();
      this.GetReadyOrders();
    }, 5000);
  }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
  GetOrderDetails(Order: any) {
    this.CurrentOrder = Order;
    this.OrderDetails = Order.OrderDetails;
  }
  GetReadyOrders() {
    if(this.searchOrderNumber) return;
    this.PreparingSer.GetReadyOrders().subscribe((data) => {
      this.ReadyOrders = data;
      this.allReadyOrders = data;
    });
  }
  GetPreparingOrders() {
    this.PreparingSer.GetPreparingOrders().subscribe((data) => {
      this.PreparingOrders = data;
      this.cdr?.detectChanges();
    });
  }
  ReceivedOrder(Order: any) {
    this.PreparingSer.UpdateReadyOrder(Order).subscribe((data) => {
      this.GetReadyOrders();
    });
  }
  MoveToReady(Order: any) {
    this.PreparingSer.MoveToReady(Order).subscribe((data) => {
      this.GetReadyOrders();
      this.GetPreparingOrders();
      $("#orderDetails").modal("hide");
    });
  }
  orderIsReceived(Order: any): void {
    Swal.fire({
      title: this.translate.instant("Shared.Areyousure?"),
      text: this.translate.instant("Shared.Youwon'tbeabletorevertthis"),
      icon: "error",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: this.translate.instant("Shared.Yes,Receivedit?"),
      cancelButtonText: this.translate.instant("Shared.Cancel")
    }).then((result) => {
      if (result.isConfirmed) {
        this.ReceivedOrder(Order);
        this.searchOrderNumber = undefined;
        this.searchForOrderNumber();
      }
    });
  }
  searchForOrderNumber(){
    if(!this.searchOrderNumber)
    {
      this.ReadyOrders = deepCopy(this.allReadyOrders);
      return;
    } 
    this.ReadyOrders = deepCopy(this.allReadyOrders.filter((order: any) => order.OrderNumber.toString().includes(this.searchOrderNumber)));
  }
  selectOrderNumber(){
    if(this.ReadyOrders?.length == 1)
      this.orderIsReceived(this.ReadyOrders[0]);
    
  }
   isDelayed(modificationTime: string | Date): boolean {
     if(!this.settingobj?.DefaultOrderPreparationTimeInMinutes)return false;
      const now = new Date();
      const modified = new Date(modificationTime);
      const diffInMs = now.getTime() - modified.getTime();
      const diffInMinutes = diffInMs / (1000 * 60);
      return diffInMinutes > this.settingobj.DefaultOrderPreparationTimeInMinutes;
    }
}
