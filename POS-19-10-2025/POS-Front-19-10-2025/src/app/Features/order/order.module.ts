import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrderComponent } from "./order/order.component";
import { OrderRoutingModule } from "./order-routing.module";
import { SharedModule } from "src/app/shared/shared.module";
import {
  PERFECT_SCROLLBAR_CONFIG,
  PerfectScrollbarConfigInterface,
  PerfectScrollbarModule
} from "ngx-perfect-scrollbar";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PaymentComponent } from "./payment/payment.component";
import { DeliveryCustomerComponent } from "./deliverycustomer/deliverycustomer.component";
import { DineInComponent } from "./dine-in/dine-in.component";
import { AngularDraggableModule } from "angular2-draggable";
import { ColorPickerModule } from "@syncfusion/ej2-angular-inputs";
import { DineContentComponent } from "./dine-content/dine-content.component";
import { PaginationModule } from "ngx-bootstrap/pagination";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { CustomerDisplayComponent } from "./customer-display/customer-display.component";
import { KeyboardModule } from "../keyboard/keyboard/keyboard.module";
import { DeliveryStatusComponent } from "./components/delivery-status/delivery-status.component";
import { DetailsCustomerComponent } from "./dialogs/details-customer/details-customer.component";
import { CustomerReservationComponent } from "./dialogs/customer-reservation/customer-reservation.component";
import { TimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { MatchPaymentsComponent } from "./dialogs/match-payments/match-payments.component";
import { AssignDriverComponent } from "./dialogs/assign-driver/assign-driver.component";
import { CarouselModule } from "ngx-bootstrap/carousel";
import { AccordionModule } from "ngx-bootstrap/accordion";
import { PricePipeDirective } from "src/app/shared/Directives/price-pipe-directive";
import { TableGameComponent } from './dialogs/table-game/table-game.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelPropagation: true
};

@NgModule({
  declarations: [
    OrderComponent,
    PaymentComponent,
    DeliveryCustomerComponent,
    DineInComponent,
    DineContentComponent,
    CustomerDisplayComponent,
    DeliveryStatusComponent,
    DetailsCustomerComponent,
    CustomerReservationComponent,
    MatchPaymentsComponent,
    AssignDriverComponent,
    PricePipeDirective,
    TableGameComponent
  ],

  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule,
    PerfectScrollbarModule,
    FormsModule,
    ReactiveFormsModule,
    AngularDraggableModule,
    ColorPickerModule,
    PaginationModule.forRoot(),
    ButtonsModule.forRoot(),
    KeyboardModule,
    TimePickerModule,
    CarouselModule.forRoot(),
    AccordionModule.forRoot(),
    BsDropdownModule.forRoot(),
  ],

  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    }
  ]
})
export class OrderModule {}
