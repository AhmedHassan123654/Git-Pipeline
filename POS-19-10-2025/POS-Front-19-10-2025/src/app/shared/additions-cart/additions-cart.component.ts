import { Component, OnInit } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { MenuItem } from "src/app/app.model";
import { AppService } from "src/app/core/Services/app.service";
import { CartOverviewComponent } from "../cart-overview/cart-overview.component";
import { ProductModel } from "src/app/core/Models/Transactions/product-model";
import { CommonService, ToastrService, HandlingBackMessages } from "../Directives/pagetransactionsimport";
import { OrderDetailModel } from "src/app/core/Models/Transactions/order-detail-model";
import { OrderDetailSubItemModel } from "src/app/core/Models/Transactions/order-detail-sub-item-model";
import { ProductVolumeModel } from "src/app/core/Models/Transactions/product-volume-model";
import { ProductSubItemModel } from "src/app/core/Models/Transactions/product-sub-item-model";
import { OrderModel } from "src/app/core/Models/order/orderModel";
import { NoteModel } from "src/app/core/Models/Transactions/note-model";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
import { OrderDetailNoteModel } from "src/app/core/Models/Transactions/order-detail-note-model";
import { GenericHelper } from "src/app/Features/GenericHelper";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-additions-cart",
  templateUrl: "./additions-cart.component.html",
  styleUrls: ["./additions-cart.component.scss"]
})
export class AdditionsCartComponent extends GenericHelper implements OnInit {
  menuItem: ProductModel;
  panelOpenState = false;
  panelOpenState2 = false;
  panelOpenState3 = false;
  checked = false;
  indeterminate = false;
  labelPosition: "before" | "after" = "after";
  disabled = false;
  [key: string]: any;
  orderDetail: OrderDetailModel;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true,
    useBothWheelAxes: true
  };
  constructor(
    public appService: AppService,
    private bottomSheetRef: MatBottomSheetRef<AdditionsCartComponent>,
    private common: CommonService,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages,
    public translate: TranslateService,
    public orderSer: OrderService
  ) {
    super();
    this.defaultIm = "assets/images/v10.jpg";
    this.imgURL = this.common.rooturl.replace("api", "") + "StaticFiles/Images/Products/";
  }

  ngOnInit(): void {
    // this.menuItem =  this.appService.addToCart(this.menuItem, AdditionsCartComponent)
    this.getAllNotes();
    this.orderobj = this.appService.orderobj;

    this.menuItem = this.clone(this.appService.CurrentProduct);

    this.pointOfSale = this.appService.pointOfSale;
    this.productPricingClasseVolumes = this.appService.productPricingClasseVolumes;

    if (this.menuItem.ProductSubItems && this.menuItem.ProductSubItems.length) {
      this.menuItem.ProductSubItems.forEach((ps) => {
        ps.SideChecked = false;
      });
    }
    if (this.menuItem.ProductVolumes && this.menuItem.ProductVolumes.length) {
      this.menuItem.ProductVolumes.forEach((ps) => {
        ps.SelectedVolum = false;
      });
    }

    let exist = this.orderobj.OrderDetails.filter((x) => x.ProductDocumentId == this.menuItem.DocumentId)[0];
    if (exist) {
      // let index = this.orderobj.OrderDetails.indexOf(exist);
      this.isExist = true;
      this.orderDetail = exist;
      if (this.orderDetail.OrderDetailNotes) {
        let noteName = this.orderDetail.OrderDetailNotes[0];
        if (noteName) this.Note = noteName.NoteName;
      }

      if (
        this.menuItem.ProductSubItems &&
        this.menuItem.ProductSubItems.length &&
        this.orderDetail.OrderDetailSubItems &&
        this.orderDetail.OrderDetailSubItems.length
      ) {
        this.orderDetail.OrderDetailSubItems.forEach((s) => {
          let item = this.menuItem.ProductSubItems.filter((i) => i.SubItemDocumentId == s.ProductSubItemDocumentId)[0];
          if (item) item.SideChecked = true;
        });
      }
      if (
        this.menuItem.ProductVolumes &&
        this.menuItem.ProductVolumes.length &&
        (this.orderDetail.VolumeFerpCode || this.orderDetail.VolumeDocumentId)
      ) {
        let item = this.menuItem.ProductVolumes.filter(
          (i) =>
            i.VolumeFerpCode == this.orderDetail.VolumeFerpCode ||
            i.VolumeDocumentId == this.orderDetail.VolumeDocumentId
        )[0];
        if (item) item.SelectedVolum = true;
      }
    } else {
      this.isExist = false;
      this.orderDetail = new OrderDetailModel();
      this.addToOrderDetail();
    }
  }
  public addToCart2() {
    if (!this.orderobj.OrderDetails) this.orderobj.OrderDetails = [];
    if (
      this.menuItem.ProductVolumes &&
      this.menuItem.ProductVolumes.length > 0 &&
      !(this.orderDetail.VolumeFerpCode || this.orderDetail.VolumeDocumentId)
    ) {
      this.toastr.info("Please select volume first!");
      return false;
    }
    if (this.Note) {
      this.addNewNote({ Name: this.Note });
    } else {
      this.continueAddToCard();
    }
  }
  addNewNote(noteobj) {
    let note = this.noteslist.filter((n) => n.Name == this.Note)[0];
    if (note) {
      this.notesChecked(note);
      this.continueAddToCard();
    } else {
      this.orderSer.PostNote(noteobj).subscribe((res) => {
        this.getAllNotesAfterAdd();
      });
    }
  }
  getAllNotesAfterAdd() {
    this.orderSer.GetAllNotes().subscribe((res) => {
      this.noteslist = res as NoteModel[];
      let note = this.noteslist.filter((n) => n.Name == this.Note)[0];
      if (note) this.notesChecked(note);
      this.continueAddToCard();
    });
  }
  getAllNotes() {
    this.orderSer.GetAllNotes().subscribe((res) => {
      this.noteslist = res as NoteModel[];
    });
  }
  notesChecked(note: any) {
    if (!this.orderDetail.OrderDetailNotes) this.orderDetail.OrderDetailNotes = [];

    let exist = this.orderDetail.OrderDetailNotes.filter((n) => n.NoteDocumentId == note.DocumentId)[0];
    if (!exist) {
      let orderdetailnotesobj = new OrderDetailNoteModel();
      orderdetailnotesobj.NoteId = note.Id;
      orderdetailnotesobj.NoteDocumentId = note.DocumentId;
      orderdetailnotesobj.NoteName = note.Name;
      this.orderDetail.OrderDetailNotes.push(orderdetailnotesobj);
    }
  }
  continueAddToCard() {
    if (this.checkIsProductTempStopped(this.orderDetail.Product)) {
      return false;
    }

    let exist = this.orderobj.OrderDetails.filter((x) => x.ProductDocumentId == this.menuItem.DocumentId)[0];
    if (exist) {
      let index = this.orderobj.OrderDetails.indexOf(exist);
      this.orderobj.OrderDetails[index] = this.orderDetail;
    } else this.orderobj.OrderDetails.push(this.clone(this.orderDetail));

    this.appService.orderobj = this.orderobj;
    this.appService.addToCart(null, CartOverviewComponent);
    // this.appService.addToCart2(this.menuItem, CartOverviewComponent);
    this.bottomSheetRef.dismiss(false);
  }
  public hideSheet(isRedirect: boolean) {
    this.bottomSheetRef.dismiss(isRedirect);
  }

  sideDishesChecked(event: any, productsubitem: ProductSubItemModel) {
    if (!this.orderDetail.OrderDetailSubItems) this.orderDetail.OrderDetailSubItems = [];
    let index = this.orderDetail.OrderDetailSubItems.findIndex(
      (p) =>
        (productsubitem.SubItemId && p.ProductSubItemId === productsubitem.SubItemId) ||
        (productsubitem.SubItemDocumentId && p.ProductSubItemDocumentId === productsubitem.SubItemDocumentId)
    );
    if (!event.checked) {
      productsubitem.SideChecked = false;
      this.orderDetail.OrderDetailSubItems.splice(index, 1);
    } else {
      productsubitem.SideChecked = true;
      let orderdetailsubitemobj = new OrderDetailSubItemModel();

      orderdetailsubitemobj.ProductSubItemId = productsubitem.SubItemId;
      if (!productsubitem.SubItemDocumentId && productsubitem.SubItemId > 0) {
        productsubitem.SubItemDocumentId = this.appService.allproductlist.filter(
          (x) => x.Id == productsubitem.SubItemId
        )[0]?.DocumentId;
      }
      orderdetailsubitemobj.ProductSubItemDocumentId = productsubitem.SubItemDocumentId;
      orderdetailsubitemobj.ProductSubItemName = productsubitem.Name;
      orderdetailsubitemobj.Name = productsubitem.Name;
      orderdetailsubitemobj.Price = productsubitem.NewPrice;
      orderdetailsubitemobj.SingleQuantity = 1;
      productsubitem.QTY = 1;
      orderdetailsubitemobj.Total = orderdetailsubitemobj.Price;

      this.orderDetail.OrderDetailSubItems.push(orderdetailsubitemobj);
    }
  }

  volumChecked(event: any, productvolum: ProductVolumeModel) {
    if (!event.checked) {
      productvolum.SelectedVolum = false;
    } else {
      this.menuItem.ProductVolumes.forEach((x) => (x.SelectedVolum = false));
      productvolum.SelectedVolum = true;

      let thisProduct = Object.assign({}, this.menuItem);
      let productPricingClassVolumes = this.appService.getProductPricingClasseVolumes(
        thisProduct,
        this.orderobj,
        this.pointOfSale
      );
      let productPricingClassVolume = productPricingClassVolumes
        ? Object.assign(
            {},
            productPricingClassVolumes.find(
              (x) =>
                (productvolum.VolumeFerpCode && x.VolumeFerpCode == productvolum.VolumeFerpCode) ||
                (productvolum.VolumeId && x.VolumeId == productvolum.VolumeId) ||
                (productvolum.VolumeDocumentId && x.VolumeDocumentId == productvolum.VolumeDocumentId)
            )
          )
        : undefined;

      this.orderDetail.ProductPrice =
        productPricingClassVolume && productPricingClassVolume.Price ? productPricingClassVolume.Price : 0;
      this.orderDetail.ProductVolumName = productvolum.VolumeName;
      this.orderDetail.VolumeId = productvolum.VolumeId;
      this.orderDetail.VolumeDocumentId = productvolum.VolumeDocumentId;
      this.orderDetail.VolumeFerpCode = productvolum.VolumeFerpCode;
      this.orderDetail.Product.Price =
        productPricingClassVolume && productPricingClassVolume.Price ? productPricingClassVolume.Price : 0;
    }
  }
  addToOrderDetail() {
    this.orderDetail.OrderDetailPromo = [];
    this.orderDetail.ProductId = this.menuItem.Id;
    this.orderDetail.ProductDocumentId = this.menuItem.DocumentId;
    this.orderDetail.ProductPrice = this.menuItem.Price;
    this.orderDetail.ProductName = this.menuItem.Name;
    this.orderDetail.Product = this.menuItem;
    this.orderDetail.ProductGroupId = this.menuItem.ProductGroupId;
    this.orderDetail.ProductGroupDocumentId = this.menuItem.ProductGroupDocumentId;
    this.orderDetail.ProductGroupName = this.menuItem.ProductGroupName;
    this.orderDetail.ProductQuantity = 1;
  }
  checkIsProductTempStopped(product) {
    let productProperties = this.appService.productsProperties.filter(
      (x) =>
        (product.Id && x.ProductId == product.Id) || (product.DocumentId && x.ProductDocumentId == product.DocumentId)
    )[0];
    let stoppedDate = new Date(productProperties?.StopeDate);
    if (
      productProperties &&
      productProperties.IsTempStop &&
      stoppedDate instanceof Date &&
      !isNaN(stoppedDate.valueOf()) &&
      productProperties.StopDurationType &&
      productProperties.StopDuration
    ) {
      let currentDate = new Date();
      if (productProperties.StopDurationType == "1") {
        let difMinutes = (currentDate.getTime() - stoppedDate.getTime()) / (1000 * 60);
        if (difMinutes < Number(productProperties.StopDuration)) {
          this.toastr.info(
            this.translate.instant("messages.StopProduct") +
              Math.ceil(Number(productProperties.StopDuration) - difMinutes) +
              " " +
              this.translate.instant("Shared.Minutes")
          );
          return true;
        } else {
          productProperties.IsTempStop = false;
          this.StopProduct(productProperties);
        }
      } else if (productProperties.StopDurationType == "2") {
        let difHouers = (currentDate.getTime() - stoppedDate.getTime()) / (1000 * 60 * 60);
        if (difHouers < Number(productProperties.StopDuration)) {
          this.toastr.info(
            this.translate.instant("messages.StopProduct") +
              Math.ceil(Number(productProperties.StopDuration) - difHouers) +
              " " +
              this.translate.instant("setting.Hours")
          );
          return true;
        } else {
          productProperties.IsTempStop = false;
          this.StopProduct(productProperties);
        }
      } else if (productProperties.StopDurationType == "3") {
        let difDays = (currentDate.getTime() - stoppedDate.getTime()) / (1000 * 60 * 60 * 24);
        if (difDays < Number(productProperties.StopDuration)) {
          this.toastr.info(
            this.translate.instant("messages.StopProduct") +
              Math.ceil(Number(productProperties.StopDuration) - difDays) +
              " " +
              this.translate.instant("setting.Days")
          );
          return true;
        } else {
          productProperties.IsTempStop = false;
          this.StopProduct(productProperties);
        }
      }
    }
    return false;
  }
  StopProduct(productToStop) {
    this.orderSer.stopProductForAwhile(productToStop).subscribe((res) => {
      this.toastr.success(this.toastrMessage.GlobalMessages(res));

      this.orderSer.getAllProductProperties().subscribe((res: any) => {
        if (res && res.length > 0) this.appService.productsProperties = res;
      });
    });
  }
}
