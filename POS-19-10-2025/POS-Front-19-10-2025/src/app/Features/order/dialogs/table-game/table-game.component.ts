import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { Observable } from "rxjs";
import { ModalResult } from "src/app/core/Models/Shared/modal-result.interface";
import { OrderModel } from "src/app/core/Models/order/orderModel";
import { ProductModel } from "src/app/core/Models/Transactions/product-model";
import { OrderDetailModel } from "src/app/core/Models/Transactions/order-detail-model";
import { getTimeDifferenceInSeconds } from "src/app/core/Helper/objectHelper";
import { OrderService } from "src/app/core/Services/Transactions/order.service";
@Component({
  selector: "app-table-game",
  templateUrl: "./table-game.component.html",
  styleUrls: ["./table-game.component.scss"]
})
export class TableGameComponent implements OnInit ,OnDestroy {
  language: string;
  modalResult: ModalResult = {
    role: undefined,
    data: {}
  };
  @ViewChild("frmRef") frmRef;
  customerData?: Observable<any>;
  startedTime: any;
  orderObj: OrderModel;
  fraction:string = '';
  tableInfo: any;

  formatString = "HH:mm";
  gameList:ProductModel[] = [];
  seconds: number = 0; // Elapsed time in seconds
  timer: any=0;
  selectedGame: any | undefined ;
  constructor(
    public modalRef: BsModalRef,
    public orderSer: OrderService
  ) {
    this.initializeobjects();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer); // Clear the interval to stop the timer
  }
  getOrderForTable(){
    return new Promise((resolve) => {
      this.orderSer.GetOrderForTabel(this.tableInfo.DocumentId).subscribe(
        (res) => {
          let orders = res as OrderModel[];
          if (orders && orders.length > 0){
            this.orderObj = orders[0];
            resolve(orders[0]);
          }
          else resolve(null);
        },()=>{ resolve(null);}
      );
    });
  }
  async ngOnInit() {
    if(!this.orderObj.DocumentId && this.tableInfo.Count)
      await this.getOrderForTable();  
    const startedDetail = this.orderObj.OrderDetails.find(detail => detail.StartTime && !detail.IsCancelled && !detail.EndTime);
    if(startedDetail){
      this.seconds = getTimeDifferenceInSeconds(startedDetail.StartTime, new Date().toLocaleTimeString());
      this.startInterval();
    }
  }

  startInterval(){
    this.timer = setInterval(() => {
      this.seconds++;
    }, 1000); // Increment seconds every 1 second
  }
  // Method to start the timer
  startTimer(gameInfo: any): void {
    if (!this.isRunning) this.startInterval();
    if(!gameInfo.endTime){
      const now = new Date();
      let detail = new OrderDetailModel();
      detail.ProductId = this.selectedGame.Id;
      detail.ProductDocumentId = this.selectedGame.DocumentId;
      detail.ProductName = this.selectedGame.Name;
      detail.StartTime = now.toLocaleTimeString();
      this.orderObj.OrderDetails.push(detail);
    }
  }

  // Method to stop the timer
  stopTimer(): void {
    if (this.isRunning) 
      clearInterval(this.timer); // Clear the interval to stop the timer

    let detail = this.orderObj.OrderDetails.find( (detail) => detail.StartTime && !detail.IsCancelled && !detail.EndTime)
    detail.EndTime = new Date().toLocaleTimeString();
  }
  get isRunning(): boolean {
    return this.orderObj.OrderDetails.some( (detail) => detail.StartTime && !detail.IsCancelled && !detail.EndTime);
  }
  // Getter to format time in hh:mm:ss format
  get formattedTime(): string {
    const hours = Math.floor(this.seconds / 3600); // Get hours
    const minutes = Math.floor((this.seconds % 3600) / 60); // Get minutes
    const seconds = this.seconds % 60; // Get seconds

    // Format the time with leading zeros
    return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(seconds)}`;
  }

 selectGameType(game: ProductModel) {
    
    if (this.isRunning)
      clearInterval(this.timer); // Clear the interval to stop the timer
    this.selectedGame = game;
  }

  // Helper method to add leading zeros
  private pad(value: number): string {
    return value < 10 ? `0${value}` : `${value}`;
  }

  initializeobjects(): void {
    this.modalResult.data = {};
  }
  SaveTableGame() {
    let role = "save";
    // format change for ReceivedTime
    this.modalResult = { role, data: this.gameDetails };
    this.closeModal();
  }
  closeModal() {
    this.modalRef.hide();
  }

  get gameDetails(){
    return this.orderObj.OrderDetails.filter(detail => detail.StartTime && !detail.IsCancelled);
  }
}