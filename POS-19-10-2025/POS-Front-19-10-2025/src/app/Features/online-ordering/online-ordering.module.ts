import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { OnlineOrderingRoutingModule } from "./online-ordering-routing.module";
import { MenuComponent } from "./menu/menu.component";
import { SharedModule } from "src/app/shared/shared.module";
import { ButtonsModule } from "ngx-bootstrap/buttons";
import { MenuSingleComponent } from "./menu-single/menu-single.component";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { OnlineOrderingComponent } from "./online-ordering/online-ordering.component";
import { HeaderComponent } from "./header/header.component";
import { RouterModule } from "@angular/router";
import { HomeFirstComponent } from "./home-first/home-first.component";
import { ReservationComponent } from "./reservation/reservation.component";
import { RegisterComponent } from "./register/register.component";
import { CheckoutComponent } from "./checkout/checkout.component";
import { PerfectScrollbarConfigInterface, PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { FormsModule } from "@angular/forms";
import { DatePickerModule, TimePickerModule } from "@syncfusion/ej2-angular-calendars";
import { ComboBoxModule, MultiSelectModule } from "@syncfusion/ej2-angular-dropdowns";
import { TabsModule } from "ngx-bootstrap/tabs";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};
const routes = [
  // {path:'',component:MenuComponent,pathMatch: 'full'},
  // { path:':id', component: MenuSingleComponent },
  {
    path: "",
    component: OnlineOrderingComponent,
    children: [
      { path: "", component: HomeFirstComponent },
      { path: "login", component: ReservationComponent },
      { path: "register", component: RegisterComponent },
      { path: "checkout", component: CheckoutComponent },
      { path: "menu", component: MenuComponent },
      { path: ":id", component: MenuSingleComponent }
    ]
  }
];

@NgModule({
  declarations: [
    MenuComponent,
    MenuSingleComponent,
    OnlineOrderingComponent,
    HeaderComponent,
    HomeFirstComponent,
    ReservationComponent,
    RegisterComponent,
    CheckoutComponent
  ],
  imports: [
    CommonModule,
    OnlineOrderingRoutingModule,
    SharedModule,
    PerfectScrollbarModule,
    MatSnackBarModule,
    RouterModule.forChild(routes),
    ButtonsModule.forRoot(),
    FormsModule,
    SharedModule,
    ComboBoxModule,
    DatePickerModule,
    TimePickerModule,
    MultiSelectModule,
    TabsModule.forRoot()
  ]
})
export class OnlineOrderingModule {}
