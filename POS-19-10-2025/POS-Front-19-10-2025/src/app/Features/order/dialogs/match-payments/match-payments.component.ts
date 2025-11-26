import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { IntegrationSettingService } from "../../../../core/Services/Transactions/integration-setting.service";
import { ToastrService } from "ngx-toastr";
import * as imp from "../../../integration-system/integration-setting-import";

@Component({
  selector: "app-match-payments",
  templateUrl: "./match-payments.component.html",
  styleUrls: ["./match-payments.component.scss"]
})
export class MatchPaymentsComponent implements OnInit {
  integrationDocumentId!: string;

  modalResult = { role: "dismiss", data: null };

  integrationPayTypes: any[] = [];
  orderPayTypes: any[] = [];
  integrationPaymentMethods: any[] = [];
  comboBoxFields = { text: "Name", value: "OrderPayTypeDocumentId" };

  constructor(
    public modalRef: BsModalRef,
    private integrationSettingService: IntegrationSettingService,
    private toastService: ToastrService,
    public toastrMessage: imp.HandlingBackMessages
  ) {}

  ngOnInit(): void {
    this.initializeIntegrationSettings();
  }

  save() {
    const model = {
      DocumentId: this.integrationDocumentId,
      IntegrationSettingPayments: this.integrationPaymentMethods
    };

    this.integrationSettingService.updateIntegrationPaymnts(model).subscribe((res) => {
      if (res == 1) {
        this.toastService.success(this.toastrMessage.GlobalMessages(res));
        this.modalResult = {
          role: "save",
          data: null
        };
        this.modalRef.hide();
      } else {
        this.toastService.error(this.toastrMessage.GlobalMessages(res));
      }
    });
  }

  private initializeIntegrationSettings() {
    // todo: get payment methods for integration and local
    this.integrationSettingService.GetIntegrationSettingPayments(this.integrationDocumentId).subscribe({
      next: (res: any) => {
        this.orderPayTypes = res.OrderPayTypes;
        this.integrationPaymentMethods = res.YemekOrderPayTypes;
      },
      error: (err) => {
        this.toastService.error("Cannot get payment methods!");
      }
    });
  }
}
