import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "./core/Helper/auth-guard";
import { EmailSettingComponent } from "./Features/email-setting/email-setting.component";
import { CustomerKdsComponent } from "./Features/kds/customer-kds/customer-kds.component";
import { ReadyOrderComponent } from "./Features/kds/ready-order/ready-order.component";
import { KeyboardComponent } from "./Features/keyboard/keyboard.component";
import { ForgetPasswordComponent } from "./index/forget-password/forget-password.component";
import { LoginComponent } from "./index/login/login.component";
import { AppLayoutComponent } from "./shared/app-layout/app-layout.component";
import { NotAuthorizedComponent } from "./shared/not-authorized/not-authorized.component";
import { NotFoundComponent } from "./shared/not-found/not-found.component";
import { ViewReportsComponent } from "./shared/view-reports/view-reports.component";

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "firstHome",
    loadChildren: () => import("./Features/online-ordering/online-ordering.module").then((m) => m.OnlineOrderingModule)
  },
  { path: "login", component: LoginComponent },

  {
    path: "",
    component: AppLayoutComponent,
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children: [
      // {
      //   path: "dashboard",
      //   loadChildren: () => import("./Features/dash-board/dash-board.module").then((m) => m.DashBoardModule)
      // },
      {
        path: "dashboard",
        loadChildren: () => import("./Features/new-dashboard/new-dashboard.module").then((m) => m.NewDashboardModule)
      },
      {
        path: "userprofile",
        loadChildren: () => import("./Features/user-profile/user-profile.module").then((m) => m.UserProfileModule)
      },

      {
        path: "returnorder",
        loadChildren: () => import("./Features/return-order/return-order.module").then((m) => m.ReturnOrderModule)
      },
      {
        path: "statisticalreport",
        loadChildren: () =>
          import("./Features/statistical-report/statistical-report.module").then((m) => m.StatisticalReportModule)
      },
      {
        path: "dailystock",
        loadChildren: () => import("./Features/daily-stock/daily-stock.module").then((m) => m.DailyStockModule)
      },
      {
        path: "customerGroup",
        loadChildren: () => import("./Features/customer-group/customer-group.module").then((m) => m.CustomerGroupModule)
      },
      {
        path: "CustomerPromotion",
        loadChildren: () =>
          import("./Features/customer-promotion/customer-promotion.module").then((m) => m.CustomerPromotionModule)
      },
      {
        path: "CustomerMessage",
        loadChildren: () =>
          import("./Features/customer-message/customer-message.module").then((m) => m.CustomerMessageModule)
      },
      {
        path: "minimumcharge",
        loadChildren: () => import("./Features/minimum-charge/minimum-charge.module").then((m) => m.MinimumChargeModule)
      },
      {
        path: "mypoints",
        loadChildren: () => import("./Features/my-points/my-points.module").then((m) => m.MyPointsModule)
      },
      {
        path: "OpenDay",
        loadChildren: () => import("./Features/open-day/open-day.module").then((m) => m.OpenDayModule)
      },
      {
        path: "region",
        loadChildren: () => import("./Features/region/region.module").then((m) => m.RegionModule)
      },
      {
        path: "category",
        loadChildren: () => import("./Features/category/category.module").then((m) => m.CategoryModule)
      },
      {
        path: "cashreceipt",
        loadChildren: () => import("./Features/cash-receipt/cash-receipt.module").then((m) => m.CashReceiptModule)
      },
      {
        path: "PaymentSystem",
        loadChildren: () => import("./Features/payment-system/payment-system.module").then((m) => m.PaymentSystemModule)
      },
      {
        path: "FollowOrder",
        loadChildren: () => import("./Features/order-follow/order-follow.module").then((m) => m.OrderFollowModule)
      },
      {
        path: "endShift",
        loadChildren: () => import("./Features/end-shift/end-shift.module").then((m) => m.EndShiftModule)
      },
      {
        path: "comboProducts",
        loadChildren: () => import("./Features/compo-details/compo-details.module").then((m) => m.CompoDetailsModule)
      },
      // {
      //   path: "UserGroup",
      //   loadChildren: () => import("./Features/user-group/user-group.module").then((m) => m.UserGroupModule)
      // },
      {
        path: "shifts",
        loadChildren: () => import("./Features/shifts/shifts.module").then((m) => m.ShiftsModule)
      },
      {
        path: "StopProducts",
        loadChildren: () => import("./Features/stop-products/stop-products.module").then((m) => m.StopProductsModule)
      },
      {
        path: "ReturnOrderApproved",
        loadChildren: () =>
          import("./Features/return-order-approved/return-order-approved.module").then(
            (m) => m.ReturnOrderApprovedModule
          )
      },

      {
        path: "SalesReports",
        loadChildren: () => import("./Features/report/report.module").then((m) => m.ReportModule)
      },
      {
        path: "PermissionGroup",
        loadChildren: () => import("./Features/adminstration/permission.module").then((m) => m.PermissionModule)
      },
      {
        path: "extraexpenses",
        loadChildren: () => import("./Features/extra-expenses/extra-expenses.module").then((m) => m.ExtraExpensesModule)
      },
      // {
      //   path: "returninsurancelist",
      //   loadChildren: () =>
      //     import("./Features/return-insurance/return-insurance.module").then(
      //       (m) => m.ReturnInsuranceModule
      //     ),
      // },
      {
        path: "endofdayreport",
        loadChildren: () => import("./Features/end-of-day/end-of-day.module").then((m) => m.EndOfDayModule)
      },
      {
        path: "productgroup",
        loadChildren: () => import("./Features/product-group//product-group.module").then((m) => m.ProductGroupModule)
      },
      {
        path: "manageorderlist",
        loadChildren: () => import("./Features/manage-order/manage-order.module").then((m) => m.ManageOrderModule)
      },
      {
        path: "serversync",
        loadChildren: () => import("./Features/server-sync/server-sync.module").then((m) => m.ServerSyncModule)
      },
      {
        path: "backup",
        loadChildren: () => import("./Features/backups/backups.module").then((m) => m.BackupsModule)
      },
      {
        path: "printersettings",
        loadChildren: () =>
          import("./Features/printer-settings/printer-settings.module").then((m) => m.PrinterSettingsModule)
      },
      {
        path: "assigndriver",
        loadChildren: () => import("./Features/assigndriver/assigndriver.module").then((m) => m.AssigndriverModule)
      },
      {
        path: "driver",
        loadChildren: () => import("./Features/driver/driver.module").then((m) => m.DriverModule)
      },
      {
        path: "branch",
        loadChildren: () => import("./Features/branch/branch.module").then((m) => m.BranchModule)
      },
      {
        path: "user",
        loadChildren: () => import("./Features/user/user.module").then((m) => m.UserModule)
      },

      {
        path: "POSsettings",
        loadChildren: () => import("./Features/pos-setting/pos-setting.module").then((m) => m.POSSettingModule)
      },
      {
        path: "pointofsale",
        loadChildren: () => import("./Features/point-of-sale/point-of-sale.module").then((m) => m.PointOfSaleModule)
      },
      // {
      //   path: "POSDashboard",
      //   loadChildren: () => import("./Features/posdashboard/posdashboard.module").then((m) => m.POSDashboardModule)
      // },
      {
        path: "POSDashboard",
        loadChildren: () => import("./Features/new-dashboard/new-dashboard.module").then((m) => m.NewDashboardModule)
      },
      {
        path: "salestarget",
        loadChildren: () => import("./Features/sales-target/sales-target.module").then((m) => m.SalesTargetModule)
      },
      {
        path: "customer",
        loadChildren: () => import("./Features/customer/customer.module").then((m) => m.CustomerModule)
      },
      {
        path: "printer",
        loadChildren: () => import("./Features/printer/printer.module").then((m) => m.PrinterModule)
      },
      {
        path: "biometrics",
        loadChildren: () => import("./Features/biometric/biometric.module").then((m) => m.BiometricModule)
      },
      {
        path: "transferrequest",
        loadChildren: () =>
          import("./Features/item-transfer-request/item-transfer-request.module").then(
            (m) => m.ItemTransferRequestModule
          )
      },

      {
        path: "RreceivingTransfer",
        loadChildren: () =>
          import("./Features/receiving-transfer/receiving-transfer.module").then((m) => m.ReceivingTransferModule)
      },
      {
        path: "productgroup",
        loadChildren: () => import("./Features/stocks/stock.module").then((m) => m.StockModuleModule)
      },
      {
        path: "stock",
        loadChildren: () => import("./Features/product-group/product-group.module").then((m) => m.ProductGroupModule)
      },
      {
        path: "incoming",
        loadChildren: () =>
          import("./Features/kitchenincomings/kitchenincomings.module").then((m) => m.KitchenincomingsModule)
      },
      {
        path: "productQuantitiyMonitoring",
        loadChildren: () =>
          import("./Features/product-quantites-monitoring/product-quantites-monitoring.module").then(
            (m) => m.ProductQuantitesMonitoringModule
          )
      },
      {
        path: "stockinventory",
        loadChildren: () =>
          import("./Features/inventory/stock-inventory/inventory.module").then((m) => m.InventoryModule)
      },
      {
        path: "kitcheninventory",
        loadChildren: () =>
          import("./Features/inventory/kitchen-inventory/kitcheninventory.module").then((m) => m.KitchenInventoryModule)
      },
      {
        path: "StockAdjustment",
        loadChildren: () =>
          import("./Features/StockAndKitchenAdjustment/stockadjustment/stockadjustment.module").then(
            (m) => m.StockadjustmentModule
          )
      },
      {
        path: "KitchenAdjustment",
        loadChildren: () =>
          import("./Features/StockAndKitchenAdjustment/kitchenadjustment/kitchenadjustment.module").then(
            (m) => m.KitchenadjustmentModule
          )
      },
      {
        path: "StocksReports",
        loadChildren: () =>
          import("./Features/stock-reports/general-stocks-report.module").then((m) => m.GeneralStocksReportModule)
      },
      {
        path: "cashmovementfilter",
        loadChildren: () =>
          import("./Features/cash-movement-filter/cash-movement-filter.module").then((m) => m.CashMovementFilterModule)
      },
      {
        path: "productType",
        loadChildren: () =>
          import("./Features/product/product-type/product-type.module").then((m) => m.ProductTypeModule)
      },
      {
        path: "OrderType",
        loadChildren: () => import("./Features/order-types/order-types.module").then((m) => m.OrderTypesModule)
      },

      {
        path: "changeLanguage",
        loadChildren: () =>
          import("./Features/change-language/change-language.module").then((m) => m.ChangeLanguageModule)
      },
      {
        path: "volume",
        loadChildren: () => import("./Features/volume/volume.module").then((m) => m.VolumeModule)
      },
      {
        path: "tax",
        loadChildren: () => import("./Features/taxes/taxes.module").then((m) => m.TaxesModule)
      },
      {
        path: "serviceCharge",
        loadChildren: () => import("./Features/service-charge/service-charge.module").then((m) => m.ServiceChargeModule)
      },
      {
        path: "PricingClass",
        loadChildren: () => import("./Features/pricing-class/pricing-class.module").then((m) => m.PricingClassModule)
      },
      {
        path: "product",
        loadChildren: () => import("./Features/product/product/product.module").then((m) => m.ProductModule)
      },
      {
        path: "insurance",
        loadChildren: () => import("./Features/insurance/insurance/insurance.module").then((m) => m.InsuranceModule)
      },
      {
        path: "employees",
        loadChildren: () => import("./Features/employees/employees.module").then((m) => m.EmployeesModule)
      },
      {
        path: "Feedemployees",
        loadChildren: () => import("./Features/feedemployees/feedemployees.module").then((m) => m.FeedemployeesModule)
      },
      {
        path: "IntegrationSetting",
        loadChildren: () =>
          import("./Features/integration-system/integration-system.module").then((m) => m.IntegrationSystemModule)
      },
      {
        path: "promo",
        loadChildren: () => import("./Features/promo/promo.module").then((m) => m.PromoModule)
      },
      {
        path: "OrderInsurance",
        loadChildren: () =>
          import("./Features/order-insurance/order-insurance.module").then((m) => m.OrderInsuranceModule)
      },
      {
        path: "CustomerOrders",
        loadChildren: () => import("./Features/customer-order/customer-order.module").then((m) => m.CustomerOrderModule)
      },
      {
        path: "PayType",
        loadChildren: () => import("./Features/pay-type/pay-type.module").then((m) => m.PayTypeModule)
      },
      {
        path: "returnInsurances",
        loadChildren: () =>
          import("./Features/return-insurances/return-insurances.module").then((m) => m.ReturnInsurancesModule)
      },
      {
        path: "CancellationReason",
        loadChildren: () =>
          import("./Features/cancellation-reason/cancellation-reason.module").then((m) => m.CancellationReasonModule)
      },
      {
        path: "wizard",
        loadChildren: () => import("./Features/branch-wizard/branch-wizard.module").then((m) => m.BranchWizardModule)
      },
      {
        path: "ExtraExpensesType",
        loadChildren: () =>
          import("./Features/extra-expenses-type/extra-expenses-type.module").then((m) => m.ExtraExpensesTypeModule)
      },
      {
        path: "SyncToTaxAuthority",
        loadChildren: () =>
          import("./Features/sync-to-tax-authority/sync-to-tax-authority.module").then(
            (m) => m.SyncToTaxAuthorityModule
          )
      },
      {
        path: "coupon",
        loadChildren: () => import("./Features/coupon/coupon.module").then((m) => m.CouponModule)
      },
      {
        path: "dailyinventory",
        loadChildren: () => import("./Features/daily-inventory/daily-inventory.module").then((m) => m.DailyInventoryModule)
      },
    ]
  },
  {
    path: "",
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children: [
      {
        path: "order",
        loadChildren: () => import("./Features/order/order.module").then((m) => m.OrderModule)
      },
      { path: "NotAuthorized", component: NotAuthorizedComponent },
      { path: "EmailSetting", component: EmailSettingComponent },
      {
        path: "index",
        loadChildren: () => import("./index/index.module").then((m) => m.IndexModule)
      },
      {
        path: "home",
        loadChildren: () => import("./Features/home/home.module").then((m) => m.HomeModule)
      },
      {
        path: "Kds",
        loadChildren: () => import("./Features/kds/kds.module").then((m) => m.KdsModule)
      },

      {
        path: "cart",
        loadChildren: () => import("./Features/cart/cart.module").then((m) => m.CartModule)
      },
      {
        path: "OnlineOrdering",
        loadChildren: () =>
          import("./Features/online-ordering/online-ordering.module").then((m) => m.OnlineOrderingModule)
      },
      {
        path: "CallCenterOrderList",
        loadChildren: () =>
          import("./Features/follow-call-center-order/follow-call-center-order.module").then(
            (m) => m.FollowCallCenterOrderModule
          )
      },
      { path: "readyOrder", component: ReadyOrderComponent },
      { path: "customerKds", component: CustomerKdsComponent },
      /*    {
    path:'orderWaitingList',
    loadChildren:() => import('./Features/order-waiting-list/order-waiting-list.module').then(
      m => m.OrderWaitingListModule
    )
  }, */
      {
        path: "PreparingOrder",
        loadChildren: () =>
          import("./Features/preparing-order/preparing-order.module").then((m) => m.PreparingOrderModule)
      },
      {
        path: "ReadyOrder",
        loadChildren: () => import("./Features/reading-orders/reading-orders.module").then((m) => m.ReadingOrdersModule)
      },
      {
        path: "keyboard",
        component: KeyboardComponent
      }
    ]
  },
  {
    path: "online",
    loadChildren: () => import("./Features/online-ordering/online-ordering.module").then((m) => m.OnlineOrderingModule)
  },

  { path: "viewReport", component: ViewReportsComponent },
  { path: "**", component: NotFoundComponent }
];
/* @NgModule({
    imports: [RouterModule.forRoot(routes, {useHash: true})],
    exports: [RouterModule]
}) */
@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: "legacy" })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
