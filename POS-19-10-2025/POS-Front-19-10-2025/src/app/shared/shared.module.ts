import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppLayoutComponent } from "./app-layout/app-layout.component";
import { OnlyNumberDirective } from "./Directives/only-number.directive";
import { PagetransactionsComponent } from "./Directives/pagetransactions/pagetransactions.component";
import { LanguageComponent } from "./Directives/language/language.component";
import { NotAuthorizedComponent } from "./not-authorized/not-authorized.component";
import { RouterModule } from "@angular/router";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { HttpClient } from "@angular/common/http";
import { TranslateModule, TranslateLoader, TranslateService } from "@ngx-translate/core";
import { ComboBoxModule, MultiSelectAllModule, DropDownListModule } from "@syncfusion/ej2-angular-dropdowns";
import {
  CommandColumnService,
  EditService,
  ExcelExportService,
  FilterService,
  GridModule,
  GroupService,
  PageService,
  PdfExportService,
  SortService,
  ToolbarService
} from "@syncfusion/ej2-angular-grids";
import { CalendarModule, DatePickerModule } from "@syncfusion/ej2-angular-calendars";
import { UploaderModule } from "@syncfusion/ej2-angular-inputs";
import { ProgressBarModule } from "@syncfusion/ej2-angular-progressbar";
import { DefaultImgPipe } from "../default-img.pipe";
import { CheckBoxAllModule } from "@syncfusion/ej2-angular-buttons";
import { FilterWithConditionPipe } from "../core/Helper/filterWithCondition.pipe";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { PERFECT_SCROLLBAR_CONFIG } from "ngx-perfect-scrollbar";
import { PerfectScrollbarConfigInterface } from "ngx-perfect-scrollbar";
import { StimulsoftViewerModule } from "stimulsoft-viewer-angular";
import { PrintPreviewComponent } from "./Directives/PrintPreview/PrintPreview.component";
import { ButtonModule } from "@syncfusion/ej2-angular-buttons";
import { NotFoundComponent } from "./not-found/not-found.component";
import { SetStylesComponent } from "./set-styles/set-styles.component";
import { ViewReportsComponent } from "./view-reports/view-reports.component";

import { BreadcrumbsComponent } from "./breadcrumbs/breadcrumbs.component";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";

import { MatSelectModule } from "@angular/material/select";

import { TooltipModule } from "ngx-bootstrap/tooltip";
import { MenuItemComponent } from "./menu-item/menu-item.component";
import { RatingModule } from "ngx-bootstrap/rating";
import { CartOverviewComponent } from "./cart-overview/cart-overview.component";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatListModule } from "@angular/material/list";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatBadgeModule } from "@angular/material/badge";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatMenuModule } from "@angular/material/menu";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatRadioModule } from "@angular/material/radio";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { ModalModule } from "ngx-bootstrap/modal";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { QuantityCounterComponent } from "./quantity-counter/quantity-counter.component";
import { MenuItemsToolbarComponent } from "./menu-items-toolbar/menu-items-toolbar.component";
import { AdditionsCartComponent } from "./additions-cart/additions-cart.component";
import { ReservationFormComponent } from "./reservation-form/reservation-form.component";
import { AccumulationChartModule } from "@syncfusion/ej2-angular-charts";
import { PrintCashirComponent } from "../Features/common/print-cashir/print-cashir.component";
import { KeyboardModule } from "../Features/keyboard/keyboard/keyboard.module";
import { PosReportComponent } from "../Features/report/pos-report/pos-report.component";
import { TabsModule } from "ngx-bootstrap/tabs";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { ReceivedOrdersNotificationComponent } from "../received-orders-notification/received-orders-notification.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, "assets/i18n/", ".json");
}
const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  wheelPropagation: false,
  suppressScrollX: true
};

@NgModule({
  declarations: [
    PosReportComponent,
    AppLayoutComponent,
    PagetransactionsComponent,
    LanguageComponent,
    PrintPreviewComponent,
    BreadcrumbsComponent,
    NotAuthorizedComponent,
    OnlyNumberDirective,
    DefaultImgPipe,
    FilterWithConditionPipe,
    NotFoundComponent,
    ViewReportsComponent,
    SetStylesComponent,
    MenuItemComponent,
    CartOverviewComponent,
    QuantityCounterComponent,
    MenuItemsToolbarComponent,
    AdditionsCartComponent,
    ReservationFormComponent,
    PrintCashirComponent,
    ReceivedOrdersNotificationComponent
  ],
  exports: [
    AppLayoutComponent,
    PagetransactionsComponent,
    LanguageComponent,
    PrintPreviewComponent,
    TranslateModule,
    ComboBoxModule,
    OnlyNumberDirective,
    UploaderModule,
    ProgressBarModule,
    CalendarModule,
    DatePickerModule,
    MultiSelectAllModule,
    DropDownListModule,
    CheckBoxAllModule,
    FormsModule,
    ReactiveFormsModule,
    GridModule,
    MatPaginatorModule,
    CommonModule,
    DefaultImgPipe,
    FilterWithConditionPipe,
    StimulsoftViewerModule,
    ButtonModule,
    ViewReportsComponent,
    RatingModule,
    BreadcrumbsComponent,
    MenuItemComponent,
    MenuItemsToolbarComponent,
    MatBottomSheetModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    QuantityCounterComponent,
    MatBadgeModule,
    MatTooltipModule,
    MatSidenavModule,
    MatButtonToggleModule,
    MatMenuModule,
    MatExpansionModule,
    MatRadioModule,
    MatCheckboxModule,
    ReservationFormComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    AccumulationChartModule,
    PrintCashirComponent,
    PosReportComponent,
    TabsModule,
    MatSlideToggleModule,
    DragDropModule,
    ReceivedOrdersNotificationComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ComboBoxModule,
    UploaderModule,
    ProgressBarModule,
    CalendarModule,
    DatePickerModule,
    MultiSelectAllModule,
    CheckBoxAllModule,
    FormsModule,
    StimulsoftViewerModule,
    PerfectScrollbarModule,
    ReactiveFormsModule,
    DropDownListModule,
    GridModule,
    StimulsoftViewerModule,
    TooltipModule.forRoot(),
    MatSelectModule,
    MatInputModule,
    RatingModule.forRoot(),
    ModalModule.forRoot(),

    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    MatBottomSheetModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatBadgeModule,
    MatTooltipModule,
    MatSidenavModule,
    MatMenuModule,
    MatButtonToggleModule,
    MatExpansionModule,
    MatRadioModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatFormFieldModule,
    RatingModule.forRoot(),
    AccumulationChartModule,
    KeyboardModule,
    TabsModule,
    MatSlideToggleModule,
    DragDropModule
  ],
  providers: [
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    TranslateService,
    PageService,
    SortService,
    FilterService,
    GroupService,
    EditService,
    ToolbarService,
    CommandColumnService,
    PdfExportService,
    ExcelExportService
  ]
})
export class SharedModule {}
