import { Component, OnInit } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ToastrService } from "ngx-toastr";
import * as imp from "../../../integration-system/integration-setting-import";
import { FollowOrdersService } from "../../../../core/Services/order/follow-orders.service";
import { OrderModel } from "../../../../core/Models/order/orderModel";
import { IntegrationService } from "../../../../core/Services/Transactions/integration.service";

@Component({
  selector: "app-assign-driver",
  templateUrl: "./assign-driver.component.html",
  styleUrls: ["./assign-driver.component.scss"]
})
export class AssignDriverComponent implements OnInit {
  // Required parameter for this modal
  order!: OrderModel;

  modalResult = { role: "dismiss", data: null };

  driverList: any[] = [];

  constructor(
    public modalRef: BsModalRef,
    private followOrdersService: FollowOrdersService,
    private integrationService: IntegrationService,
    private toastService: ToastrService,
    public toastrMessage: imp.HandlingBackMessages
  ) {}

  ngOnInit(): void {
    this.getAvailableDrivers();
  }

  selectDriver(driver: any) {
    if (!this.order) return;

    this.integrationService.assignToDriver(this.order.DocumentId, driver.DocumentId).subscribe((res) => {
      if (res == 1 || res == 2) {
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

  private getAvailableDrivers() {
    // todo: get payment methods for integration and local
    this.followOrdersService.GetDriverList().subscribe({
      next: (res: any) => {
        this.driverList = res;
      },
      error: (err) => {
        this.toastService.error("Cannot get payment methods!");
      }
    });
  }
}
