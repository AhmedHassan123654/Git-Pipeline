import { AfterContentChecked, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, OnDestroy, QueryList } from "@angular/core";
import { AfterViewInit, ViewChildren } from "@angular/core";
import { Component, OnInit } from "@angular/core";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { OrderModel } from "src/app/core/Models/order/orderModel";
import { ToastrService } from "ngx-toastr";
import { HandlingBackMessages, SettingService } from "../../user/userimport";
import { PrinterModel } from "src/app/core/Models/Transactions/printer-model";
import { TranslateService } from "@ngx-translate/core";
import { LocalstorgeService } from "../../../localstorge.service";
import Swal from "sweetalert2";
import { deepCopy } from "src/app/core/Helper/objectHelper";
declare var $: any;
@Component({
  selector: "app-kds",
  templateUrl: "./kds.component.html",
  styleUrls: ["./kds.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KdsComponent implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked {
  [key: string]: any;
  Sortorder: boolean = false;
  @ViewChildren("childRef") childs: QueryList<ElementRef>;
  Fullscreen: boolean = true;

  constructor(
    private cdr: ChangeDetectorRef,
    public settingSer:SettingService,
    public orderser: OrderService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private LocalstorgeService: LocalstorgeService,
    private toastrMessage: HandlingBackMessages
  ) {}
  ngAfterContentChecked() {
    this.cdr.detectChanges();

    // console.log( document.querySelectorAll('.getName'));

    // let list = document.querySelectorAll('.getName');
    //   Array.prototype.forEach.call(list, function(checkbox) {
    // console.log(checkbox.children[1].innerHTML)
    //   if(checkbox.children[1].innerHTML ==" طاولة"){
    //     console.log("hhhhhhhhhh")
    //     checkbox.parentElement.classList.add("ms-card-header_green")
    //   }else if(checkbox.children[1].innerHTML ==" توصيل"){
    //     checkbox.parentElement.classList.add("ms-card-header_warning")
    //   }else if(checkbox.children[1].innerHTML == " بيع مباشر"){
    //     checkbox.parentElement.classList.add("ms-card-header_danger")
    //   }else if(checkbox.children[1].innerHTML == " خارجي"){
    //     checkbox.parentElement.classList.add("ms-card-header_yellow")
    //   }

    // });
  }

  getCardHeight() {
    let arr = [];
    for (let child of this.childs.toArray()) {
      arr.push(child.nativeElement.clientHeight);
    }
    ///3
    let Heighest3 = arr
      .sort((a: any, b: any) => {
        return b - a;
      })
      .slice(-100);
    let xHeight =
      Heighest3 && Heighest3.length > 0
        ? Heighest3.reduce((a: any, b: any) => {
            return a + b;
          })
        : 0;
    if (!xHeight) this.vv = "100%;";
    else this.vv = xHeight + 200 + "px";

    // console.log(this.vv);
    ///4
    // let Heighest4 = arr
    // .sort( ( a:any, b:any )=> { return a - b; })
    // .slice( -5 );
    // let xHeight4 = Heighest4.reduce( ( a:any, b:any )=> { return a + b;});
    // this.vv = xHeight4+'px';

    this.cdr.detectChanges();
  }
  ngAfterViewInit() {
    this.getCardHeight();
    console.log(this.orders);
    this.orders;
  }
  openNav() {
    if (document.getElementById("ToggleBtn").classList.contains("open")) {
      document.getElementById("mySidenav").style.width = "0";
      document.getElementById("main").style.marginLeft = "0";
      document.getElementById("ToggleBtn").classList.remove("open");
    } else {
      document.getElementById("mySidenav").style.width = "250px";
      document.getElementById("main").style.marginLeft = "250px";
      document.getElementById("ToggleBtn").classList.add("open");
    }
  }

  // closeNav() {

  //   document.getElementById('ToggleBtn').classList.remove('open');
  // }
  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
    this.clearAllIntervals();
  }
  clearAllIntervals() {
    const interval_id = window.setInterval(function () {}, Number.MAX_SAFE_INTEGER);
    // Clear any timeout/interval up to that id
    for (let i = 1; i < interval_id; i++) {
      window.clearInterval(i);
    }
  }
  ngOnInit() {
    if (!this.LocalstorgeService.get("langs")) this.translate.setDefaultLang("ar");
    else this.translate.setDefaultLang(this.LocalstorgeService.get("langs"));
    this.getAllChefScreens();
    this.HelperFirstOpen();
    this.perfectScroll = false;
    let getHeight = document.querySelectorAll(".ms-card");
    let heightGet = getHeight.forEach((e) => e.clientHeight);
    console.log("hh" + heightGet);
    //full screen Icon
    var IconFullScreen = document.querySelector(".FullScreen");
    IconFullScreen.addEventListener("click", (e) => {
      if (!document.fullscreenElement) {
        (e.target as HTMLTextAreaElement).classList.remove("fa-expand");
        (e.target as HTMLTextAreaElement).classList.add("fa-compress");
      } else {
        (e.target as HTMLTextAreaElement).classList.add("fa-expand");
        (e.target as HTMLTextAreaElement).classList.remove("fa-compress");
      }
    });
    //Full screen Icon end
    //popup Start
    let editGrid = document.querySelector(".editGrid");

    //console.log(editGrid)
    editGrid.addEventListener("click", (e) => {
      this.perfectScroll = false;
      if ((e.target as HTMLTextAreaElement).classList.contains("popubtn")) {
        let ParentDiv = (e.target as HTMLTextAreaElement).parentElement;
        ParentDiv.classList.toggle("modalContin");
        let pp = ParentDiv.parentElement;
        pp.classList.toggle("modalll");
        let height = pp.offsetHeight;
        console.log(height);
      }

      if ((e.target as HTMLTextAreaElement).classList.contains("modalll")) {
        this.perfectScroll = true;
        let replaceIcon = (e.target as HTMLTextAreaElement).querySelector("i.fa");
        replaceIcon.classList.remove("fa-compress");
        replaceIcon.classList.add("fa-expand");
        console.log(replaceIcon);
        // this.perfectScroll = false;
        let removePopupContainer = e.target as HTMLTextAreaElement;
        if (removePopupContainer.classList.contains("modalll")) {
          removePopupContainer.classList.remove("modalll");
          this.perfectScroll = false;
        }
        let removePopup = removePopupContainer.children[0];
        removePopup.classList.remove("modalContin");

        //  (e.target as HTMLTextAreaElement).classList.add('fa-expand');
        //  (e.target as HTMLTextAreaElement).classList.remove('fa-compress');
      } else {
        this.perfectScroll = false;
      }

      if ((e.target as HTMLTextAreaElement).classList.contains("fa-expand")) {
        this.perfectScroll = true;
        (e.target as HTMLTextAreaElement).classList.remove("fa-expand");
        (e.target as HTMLTextAreaElement).classList.add("fa-compress");
        if (this.interval) clearInterval(this.interval);
      } else if ((e.target as HTMLTextAreaElement).classList.contains("fa-compress")) {
        this.perfectScroll = false;
        (e.target as HTMLTextAreaElement).classList.add("fa-expand");
        (e.target as HTMLTextAreaElement).classList.remove("fa-compress");
        this.interval = setInterval(() => {
          this.getAllOpenOrders();
        }, 5000);
      }
    });
    //  editGrid.addEventListener('click',e=>{
    //   if((e.target as HTMLTextAreaElement).classList.contains('ms-card')){
    //     console.log('db'+e.target)
    //   }
    // })
    //popup end

    this.changeCssFile();
  }
  getTranslationName(trSection: string, name: string) {
    return trSection + "." + (name ? name.toLowerCase() : "");
  }
  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = item[keyGetter];
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }
  getAllChefScreens() {
    this.orderser.getAllChefScreens().subscribe((res) => {
      let result = res as any;
      this.chefScreens = result.PrinterList as PrinterModel[];
      this.volumes = result.Volumes;
      $("#modal-kds").modal("show");
    });

  }
  HelperFirstOpen() {
    this.currentUserLanguage = JSON.parse(localStorage.getItem("langs"))?.toLowerCase();
    this.orderser.HelperFirstOpen().subscribe((res) => {
      this.defaultLanguage = res["Item3"].toLowerCase();
    });
    this.settingSer.GetSetting().subscribe((res) => {
        this.settingobj = res;
    });
  }
  
  CheckPassword(ChiefPassword) {
    if (this.chef.ChiefPassword && this.chef.ChiefPassword.toLowerCase() == ChiefPassword.toLowerCase()) this.Accept();
    else this.toastr.info("!تأكد من الرقم السري", "KDS");
  }
  SelectChefScreen(chef: PrinterModel, IsSelected: boolean) {
    if (IsSelected) {
      this.chefScreens.forEach((x) => {
        x.IsSelected = false;
      });
      chef.IsSelected = true;
      this.chef = chef;
      this.groupIds = chef.PrinterProductGroups.filter((x) => x.ProductGroupDocumentId).map(
        (x) => x.ProductGroupDocumentId
      );
      if (this.chef && this.chef.ChiefPassword) $("#modal-3").modal("show");
      else this.Accept();
    } else chef.IsSelected = false;
  }
  Accept() {
    if (this.chefScreens.filter((x) => x.IsSelected)[0]) {
      this.getAllOpenOrders();
      this.interval = setInterval(() => {
        this.getAllOpenOrders();
      }, 5000);
      $("#modal-kds").modal("hide");
      $("#modal-3").modal("hide");
    }
  }
  addOrderTypeColor(order: OrderModel) {
    if (order.OrderType.Value == 4) {
      order.class = "ms-card-header_green";
    } else if (order.OrderType.Value == 2) {
      order.class = "ms-card-header_warning";
    } else if (order.OrderType.Value == 1) {
      order.class = "ms-card-header_danger";
    }
    // else if(checkbox.children[1].innerHTML == " خارجي"){
    //   checkbox.parentElement.classList.add("ms-card-header_yellow")
    // }
    return order;
  }
  getAllOpenOrders() {
    if(this.searchOrderNumber) return;
    this.orderser.GetAllOpenOrders(this.chef).subscribe((res) => {
      this.allDetails = [];
      this.allSideDishes = [];
      this.sumaryList = [];
      this.orders = res as OrderModel[];
      let newOrdersCount = this.orders
        .map((item) => item.OrderNumber)
        .filter((value, index, self) => self.indexOf(value) === index);
      if (!this.ordersCount) this.ordersCount = [];
      if (newOrdersCount.length > this.ordersCount.length) {
        let audio = new Audio("/../../../../assets/Config/song.mp3");
        audio.play();
      }
      this.ordersCount = newOrdersCount;
      this.orders.forEach((x) => {
        x = this.addOrderTypeColor(x);
        x.CreationTime = new Date(x.CreationTime);
        x.ModificationTime = new Date(x.ModificationTime);
        // get remaining Time For KOT
        let ProductsPeriodTime = x.OrderDetails.map((od) => od.Product?.ProductPeriodTime);
        x.MaxProductPeriodTime = Math.max.apply(null, ProductsPeriodTime);
        if (x.MaxProductPeriodTime && x.MaxProductPeriodTime > 0) {
          if (new Date().getHours() == x.ModificationTime.getHours()) {
            let nowMinutes = new Date().getMinutes() - x.ModificationTime.getMinutes();
            x.RemainingTime = x.MaxProductPeriodTime - nowMinutes;
          } else if (new Date().getHours() > x.ModificationTime.getHours()) {
            let plusHouers = new Date().getHours() - x.ModificationTime.getHours();
            let nowMinutes = new Date().getMinutes() + plusHouers * 60 - x.ModificationTime.getMinutes();
            x.RemainingTime = x.MaxProductPeriodTime - nowMinutes;
          }
        }
        let details = x.OrderDetails.filter(
          (x) => !x.ProductDone && this.groupIds.includes(x.ProductGroupDocumentId)
        );
        if (details && details.length > 0) this.allDetails.push.apply(this.allDetails, details);
        details.forEach((d) => {
          if (d.VolumeId && d.VolumeId > 0) {
            let v = this.volumes.find((v) => v.Id == d.VolumeId);
            d.Product.Name = d.Product.Name + "-" + v.Name;
          }
          if (d.OrderDetailSubItems && d.OrderDetailSubItems.length > 0)
            this.allSideDishes.push.apply(this.allSideDishes, d.OrderDetailSubItems);
        });
      });
      this.sumaryList = [];
      this.allDetails.forEach((d) => {
        if (this.groupIds.includes(d.ProductGroupDocumentId))
          this.sumaryList.push({
            Name: d.Product?.Name,
            Qty: d.ProductQuantity
          });
      });
      this.allSideDishes.forEach((s) => {
        this.sumaryList.push({ Name: s.ProductSubItemName, Qty: s.Quantity });
      });

      let ProductGroupedByName = this.groupBy(this.sumaryList, "Name");
      this.finalSummarylist = [];
      ProductGroupedByName.forEach((c) => {
        var sumNumber = c.map((mm) => mm.Qty).reduce((first, curr) => first + curr, 0);
        this.finalSummarylist.push({
          Name: c[0]?.Name,
          Qty: c.map((mm) => mm.Qty).reduce((first, curr) => first + curr, 0)
        });
      });

      this.orders.sort((a, b) => {
        if (this.Sortorder) return b.ModificationTime - a.ModificationTime;
        else return a.ModificationTime - b.ModificationTime;
      });
      this.orders = this.orders.filter(x=>x.OrderDetails?.length  && x.OrderDetails.some(d=>!d.ProductDone && this.groupIds.includes(d.ProductGroupDocumentId)));
      this.allOrders = deepCopy(this.orders);

      this.getCardHeight();
    });
  }
  changeCssFile() {
    if (this.LocalstorgeService.get("langs") == null) this.LocalstorgeService.set("langs", "en");

    let langsSet: string = this.LocalstorgeService.get("langs");
    //let langsSet="en";
    let headTag = document.getElementsByTagName("head")[0] as HTMLHeadElement;
    let existingLink = document.getElementById("langCss") as HTMLLinkElement;
    let bundleName = langsSet === "ar" ? "englishStyle.css" : "englishStyle.css";
    if (existingLink) {
      existingLink.href = bundleName;
    } else {
      let newLink = document.createElement("link");
      newLink.rel = "stylesheet";
      newLink.type = "text/css";
      newLink.id = "langCss";
      newLink.href = bundleName;
      headTag.appendChild(newLink);
    }

    this.translate.setDefaultLang(langsSet);
    this.translate.use(langsSet);
    let htmlTag = document.getElementsByTagName("html")[0] as HTMLHtmlElement;
    htmlTag.dir = langsSet === "ar" ? "ltr" : "ltr";
    this.setLang = langsSet;
  }
  Resort() {
    this.Sortorder = !this.Sortorder;
    this.getAllOpenOrders();
  }
  returnNumb() {
    let value3 = Math.floor(Math.random() * 10);
    return value3;
  }
  setOrderDone(order) {
    let details = order.OrderDetails.filter((x) => this.groupIds.includes(x.ProductGroupDocumentId));
    order.OrderDetails = [];
    order.OrderDetails = details;
    this.orderser.SetOrderDone(order).subscribe((res) => {
      if (res == 1) {
        this.getAllOpenOrders();
        this.toastr.info(this.toastrMessage.GlobalMessages(res), "KDS");
      } else this.toastr.info(this.toastrMessage.GlobalMessages(res), "KDS");
    });
  }
  setAllOrderDone() {
    Swal.fire({
      title: "",
      text: this.translate.instant("messages.AreYouSureMakeAllOrdersDone"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes"
    }).then((result) => {
      if (result.isConfirmed) {
        this.requestStarted = true;
        this.orders.forEach((order) => {
          let details = order.OrderDetails.filter((x) => this.groupIds.includes(x.ProductGroupDocumentId));
          order.OrderDetails = [];
          order.OrderDetails = details;
        });

        this.orderser.SetAllOrderDone(this.orders).subscribe((res) => {
          if (res == 1) {
            this.getAllOpenOrders();
            this.toastr.info(this.toastrMessage.GlobalMessages(res), "KDS");
          } else this.toastr.info(this.toastrMessage.GlobalMessages(res), "KDS");
          this.requestStarted = false;
        });
      }
    });
  }
  //////////
  openFullscreen() {
    if (document.fullscreenElement) {
      this.Fullscreen = false;
      document
        .exitFullscreen()
        .then(() => console.log("Document Exited form Full screen mode"))
        .catch((err) => console.error(err));
    } else {
      document.documentElement.requestFullscreen();
      this.Fullscreen = true;
    }
  }
  // selectItem(index):void {
  //   this.selectedIdx = index;
  // }
  isFiltteredProduct(detail: any) {
    return this.searchProduct && detail.Product?.Name?.toLowerCase().includes(this.searchProduct.toLowerCase());
  }
  getName(ob) {
    if(!ob) return '';
    if (ob.ProductProperties && ob.ProductProperties.Name && !ob.VolumeId && !ob.VolumeDocumentId) {
      return ob.ProductProperties.Name ?? "";
    } else if (this.defaultLanguage && this.settingobj && this.currentUserLanguage) {
      if (this.settingobj.ShowBothNameAndForeignName && ob.ForiegnName && ob.ForiegnName != "") {
        return (ob.Name ?? "") + " , " + (ob.ForiegnName ?? "");
      } else if (this.settingobj.NamesOfProductsBasedOnMainUserLang) {
        if (!this.currentUserLanguage.includes(this.defaultLanguage) && ob.ForiegnName && ob.ForiegnName != "")
          return ob.ForiegnName ?? "";
        else return ob.Name ?? "";
      }
      return ob.Name ?? "";
    }
    return ob.Name ?? "";
  }

  searchForOrderNumber(){
      if(!this.searchOrderNumber)
      {
        this.orders = deepCopy(this.allOrders);
        return;
      } 
      this.orders = deepCopy(this.allOrders.filter((order: any) => order.OrderNumber.toString().includes(this.searchOrderNumber)));
    }
    selectOrderNumber(){
      if(this.orders?.length == 1){
        this.setOrderDone(this.orders[0]);
        this.searchOrderNumber = '';
        this.getAllOpenOrders();
      }
      
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
