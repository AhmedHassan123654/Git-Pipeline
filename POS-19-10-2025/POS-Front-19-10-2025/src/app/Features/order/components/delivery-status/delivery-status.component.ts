import { Component, Input } from "@angular/core";

export enum DeliveryStatus {
  Unapproved = 0,
  Undercooking = 1,
  Delivered = 2,
  NotDelivered = 3,
  Finished = 4,
  Acknowledged = 5,
  FoodReady = 6,
  Completed = 7,
  Cancelled = 8,
  CancelledRes = 9,
  AssignToDriver = 10,
  OnDeliver = 11,
  Cooked = 12
}

@Component({
  selector: "app-delivery-status",
  templateUrl: "./delivery-status.component.html",
  styleUrls: ["./delivery-status.component.scss"]
})
export class DeliveryStatusComponent {
  @Input() status: number | DeliveryStatus = -1;
  @Input() onlyText: boolean = false;
}
