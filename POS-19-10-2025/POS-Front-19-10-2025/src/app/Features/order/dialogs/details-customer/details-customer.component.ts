import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { OrderService } from "../../../../core/Services/Transactions/order.service";
import { LanguageSerService } from "../../../../core/Services/language-ser.service";
import { TranslateService } from "@ngx-translate/core";
import { HandlingBackMessages, ToastrService } from "../../../manage-order/manageorderimport";
import { ModalResult } from "../../../../core/Models/Shared/modal-result.interface";

@Component({
  selector: "app-details-customer",
  templateUrl: "./details-customer.component.html",
  styleUrls: ["./details-customer.component.scss"]
})
export class DetailsCustomerComponent implements OnInit {
  language: string;

  [key: string]: any;

  modalResult: ModalResult;

  constructor(
    private languageSerService: LanguageSerService,
    public translate: TranslateService,
    public toastr: ToastrService,
    public toastrMessage: HandlingBackMessages,
    public orderSer: OrderService,
    public modalRef: BsModalRef
  ) {}

  initObj() {
    if (!this.customerToAdd) this.customerToAdd = {};
  }

  ngOnInit(): void {
    this.initObj();
  }

  submitCustomerDetail(form) {
    if (!form.form.valid) return false;
    this.orderSer.GetCustomerByPhone(this.customerToAdd.Phone).subscribe((res) => {
      if ((res as boolean) == true) {
        this.toastr.warning(this.translate.instant("Shared.CustomerExist"), this.translate.instant("Shared.Customer"));
      } else {
        this.customerToAdd.UseCredit = true;
        this.orderSer.PostCustomer(this.customerToAdd).subscribe((res) => {
          if (res == 1) {
            this.toastr.success(this.toastrMessage.GlobalMessages(res));
            this.modalResult = { role: "save", data: this.customerToAdd };
            this.closeModal();
          } else {
            this.toastr.warning(this.toastrMessage.GlobalMessages(res));
            this.modalResult = { role: "cancel", data: null };
            this.closeModal();
          }
        });
      }
    });
  }

  closeModal() {
    this.modalRef.hide();
  }
}
