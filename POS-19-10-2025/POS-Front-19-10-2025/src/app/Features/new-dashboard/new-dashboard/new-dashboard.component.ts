import { AfterViewInit, Component, Renderer2, OnDestroy } from "@angular/core";
import { DashboardModel, KPIType, Comparison, PayTypes, DashboardFilters } from "../dashboard-model";
import { DashboardService } from "src/app/core/Services/Transactions/dashboard.service";
import { TranslateService } from "@ngx-translate/core";
import { LanguageSerService } from "../../point-of-sale/pointofsaleimports";
import { getOnlyDateString } from "src/app/core/Helper/objectHelper";
// Use global Chart from CDN
declare var Chart: any;
@Component({
  selector: "app-new-dashboard",
  templateUrl: "./new-dashboard.component.html",
  styleUrls: ["./new-dashboard.component.scss"],
})

export class NewDashboardComponent implements AfterViewInit, OnDestroy {
  fraction = "1.2-2";
  filters: DashboardFilters = { FilterType: 'daily' , Date:getOnlyDateString(new Date()) };
  language: string = 'en';
  requestStarted = false;
  loadedScriptElement :any[] = [];
  constructor(private renderer: Renderer2, private dashboardService: DashboardService,
    private languageSerService: LanguageSerService, private translate: TranslateService) {
    this.loadData();
    this.languageSerService.currentLang.subscribe((lan) => (this.language = lan));
    this.translate.use(this.language);
    this.applyFilters();
  }
  getPaymentIcon(payType :PayTypes): string {
    switch (payType) {
      case PayTypes.Credit:
        return '🧾';
      case PayTypes.Cash:
        return '💳';
      case PayTypes.Visa:
        return '💵';
      default:
        return '💰';
    }
  }
  getKpiBorderClass(kpiType: KPIType): string {
    switch (kpiType) {
      case KPIType.Orders:
        return 'border-blue-700';
      case KPIType.ReturnOrders:
        return 'border-red-600';
      case  KPIType.NetSales:
        return 'border-green-600';
      case KPIType.CashReceipt:
        return 'border-yellow-600';
      case KPIType.ExtraExpenses:
        return 'border-purple-600';
      default:
        return 'border-gray-600';
    }
  }
 
  async loadData(): Promise<void> {
    await this.loadAssets();
    this.handleData();
  }

  ngOnDestroy(): void {
    try{
      // REMOVE SCRIPTS
      if (this.loadedScriptElement?.length)
        this.loadedScriptElement.forEach((s) => this.renderer.removeChild(document.body, s));
      // REMOVE CANVAS
      const C: any = (window as any).Chart || Chart;
      const ids = ['ordersHourChart','hourlySalesChart','paymentChart','discountChart','invoiceTypeChart','topProductsChart','topPaymentsChart','topBranchesChart','topUsersChart'];
      this.distroyOldCanvases(ids, C);
    } catch {}
  }
  async ngAfterViewInit(): Promise<void> {
    // this.handleData(200);
  }
  private loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = this.renderer.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject();
      this.renderer.appendChild(document.body, script);
      this.loadedScriptElement.push(script);
    });
  }

  private async loadAssets(): Promise<void> {
      // this.loadStyle('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap');
  this.loadCss('assets/sass/tailwind/tailwind.css');
    await Promise.all([
      // Tailwind via CDN script (injects styles)
      // this.loadScript('assets/js/tail-windcss.js'),
      // Chart.js
      this.loadScript('assets/js/jsdelivr.js')
    ]);
    console.log('✅ All scripts loaded');
  }
  loadCss(href: string): void {
    const link = this.renderer.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    this.renderer.appendChild(document.head, link);
    // this.loadedStyleElement = link;
  }
  private initDashboard(): void {
    // Filters are now handled with Angular bindings in the template

    // Bind remaining charts from dashboardData
    const invoicesToday: Record<string, number> = this.dashboardData.OrdersCompare.reduce((acc, comp) => {
         acc[comp.Name] = comp.OrdersForPerid || 0;
         return acc;
    }, {} as Record<string, number>);
    const hours: string[] = this.dashboardData.Hours.map(h => h.Hour || '');
    const ordersPerHour: number[] = this.dashboardData.Hours.map(h => h.Count || 0);
    const hourlySales: number[] = this.dashboardData.Hours.map(h => h.Amount || 0);
    const discountsPerHour: number[] = this.dashboardData.Hours.map(h => h.Discount || 0);
    const paymentsMix: Record<string, number> = this.dashboardData.Kpis.find(k => k.Type === KPIType.Orders)?.Payments.reduce((acc, pay) => {
      acc[pay.PayName] = pay.Amount;
      return acc;
    }, {} as Record<string, number>) || {};
    const topProducts: Record<string, number> = this.dashboardData.TopProducts || {};
    const topBranches: Record<string, number> = this.dashboardData.TopBranches || {};
    const userSales: Record<string, number> = this.dashboardData.UserSales || {};

    const renderCharts = () => {
      const C: any = (window as any).Chart || Chart;
      // Safely destroy existing charts on these canvases before re-creating
      const canvasIds = ['ordersHourChart','hourlySalesChart','paymentChart','discountChart','invoiceTypeChart','topProductsChart','topPaymentsChart','topBranchesChart','topUsersChart'];
      this.distroyOldCanvases(canvasIds, C);
      new C(document.getElementById('ordersHourChart') as any, { type: 'bar', data: { labels: hours, datasets: [{ label: this.translate.instant('Dashboard.OrdersCount'), data: ordersPerHour, backgroundColor: '#2563eb' }] } });
      new C(document.getElementById('hourlySalesChart') as any, { type: 'bar', data: { labels: hours, datasets: [{ label: this.translate.instant('Dashboard.OrdersAmount'), data: hourlySales, backgroundColor: '#1e40af' }] } });
      new C(document.getElementById('paymentChart') as any, { type: 'doughnut', data: { labels: Object.keys(paymentsMix), datasets: [{ data: Object.values(paymentsMix), backgroundColor: ['#3b82f6','#8b5cf6','#f59e0b','#10b981'] }] } });
      new C(document.getElementById('discountChart') as any, { type: 'bar', data: { labels: hours, datasets: [{ label: this.translate.instant('Dashboard.Discounts'), data: discountsPerHour, backgroundColor: '#f97316' }] } });
      new C(document.getElementById('invoiceTypeChart') as any, { type: 'pie', data: { labels: Object.keys(invoicesToday), datasets: [{ data: Object.values(invoicesToday), backgroundColor: ['#2563eb','#ef4444','#f59e0b'] }] } });
      new C(document.getElementById('topProductsChart') as any, { type: 'bar', data: { labels: Object.keys(topProducts), datasets: [{ label: this.translate.instant('Dashboard.BestPerformanceProducts'), data: Object.values(topProducts), backgroundColor: '#2563eb' }] }, options: { indexAxis: 'y' } });
      new C(document.getElementById('topPaymentsChart') as any, { type: 'bar', data: { labels: Object.keys(paymentsMix), datasets: [{ label: this.translate.instant('Dashboard.TopPaymentMethods'),data: Object.values(paymentsMix), backgroundColor: '#f59e0b' }] }, options: { indexAxis: 'y' } });
      new C(document.getElementById('topBranchesChart') as any, { type: 'bar', data: { labels: Object.keys(topBranches), datasets: [{ label: this.translate.instant('Dashboard.TopBranches'),data: Object.values(topBranches), backgroundColor: '#10b981' }] }, options: { indexAxis: 'y' } });
      new C(document.getElementById('topUsersChart') as any, { type: 'bar', data: { labels: Object.keys(userSales), datasets: [{ label: this.translate.instant('Dashboard.TopSellingUsers'),data: Object.values(userSales), backgroundColor: '#0ea5e9' }] }, options: { indexAxis: 'y' } });
    };

    const buildUserPercentages = () => {
      const el = document.getElementById('userPercentages');
      if (!el) return;
      const total = Object.values(userSales).reduce((a, b) => a + b, 0);
      let html = '';
      Object.entries(userSales).forEach(([u, v]) => {
        const pct = (v / total) * 100;
        const txt = this.translate.instant('Dashboard.UserSellPerc').replace('{0}', u).replace('{1}', pct.toFixed(1));
        html += `<div>${txt}</div>`;
      });
      (el as HTMLElement).innerHTML = html;
    };

    renderCharts();
    buildUserPercentages();
  }

  private distroyOldCanvases(canvasIds: string[], C: any) {
    canvasIds.forEach(id => {
      const el = document.getElementById(id) as HTMLCanvasElement | null;
      if (!el) return;
      try {
        if (C && typeof C.getChart === 'function') {
          const ex = C.getChart(el);
          if (ex) ex.destroy();
        } else if ((C as any).instances) {
          const insts: any[] = Array.isArray((C as any).instances)
            ? (C as any).instances
            : ((C as any).instances.values ? Array.from((C as any).instances.values()) : []);
          insts.forEach(i => {
            try { if (i && i.canvas && i.canvas.id === id) { i.destroy(); } } catch { }
          });
        }
      } catch { }
    });
  }

  isLastPayment(payments: { Type: string; Amount: number; PayType: PayTypes; Icon: string }[], payment: { Type: string; Amount: number; PayType: PayTypes; Icon: string }): boolean {
    return payments.indexOf(payment) === payments.length - 1;
  }
  dashboardData :DashboardModel = new DashboardModel();
    
  getOrdersComparisonIcon(orderComp: Comparison) {
    if (orderComp.OrdersForPerid > orderComp.OrdersLastPerid) 
      orderComp.Icon = '🔼';
    else if (orderComp.OrdersForPerid < orderComp.OrdersLastPerid) 
      orderComp.Icon = '🔻';
    else orderComp.Icon = '➖';

    orderComp.Percentage = orderComp.OrdersLastPerid && orderComp.OrdersLastPerid !== 0 ?
      ((orderComp.OrdersForPerid! - orderComp.OrdersLastPerid) / orderComp.OrdersLastPerid) * 100 : 0;

    orderComp.Percentage = Math.round(orderComp.Percentage * 10) / 10;
    orderComp.Color = orderComp.Percentage > 0 ? 'text-green-600' : orderComp.Percentage < 0 ? 'text-red-600' : 'text-gray-600';
    return orderComp.Icon;

  }
  handleData(timeout = 0){
    this.dashboardData.Kpis.forEach(kpi => {
      kpi.Name = this.translate.instant(`Screens.${KPIType[kpi.Type]}`);
      kpi.TotalAmount = kpi.Payments.reduce((total, payment) => total + payment.Amount, 0);
      kpi.BorderClass = this.getKpiBorderClass(kpi.Type);
      kpi.Payments.forEach(payment => {
        payment.Icon = this.getPaymentIcon(payment.PayType);
      });
    });
    const totalSales = this.dashboardData.Kpis.find(kpi => kpi.Type === KPIType.Orders)?.TotalAmount || 0;
    const totalReturn = this.dashboardData.Kpis.find(kpi => kpi.Type === KPIType.ReturnOrders)?.TotalAmount || 0;
    let netKpi = this.dashboardData.Kpis.find(kpi => kpi.Type === KPIType.NetSales);
    if(netKpi) netKpi.TotalAmount = totalSales - totalReturn;
    this.dashboardData.OrdersCompare.forEach(orderComp => {
      this.getOrdersComparisonIcon(orderComp);
    });
    this.dashboardData.OrderTypesCompare.forEach(orderComp => {
      this.getOrdersComparisonIcon(orderComp);
    });
    this.buildInsights();
    setTimeout(() => this.initDashboard(), timeout);
  }

  buildInsights() {
    if(this.dashboardData.Hours.length === 0) return; 
    const maxVal = Math.max(...this.dashboardData.Hours.map(h => h.Amount || 0));
    const maxHour = this.dashboardData.Hours.find(h => h.Amount === maxVal)?.Hour || '';
    this.dashboardData.SmartInsights = [];
    const maxHourTxt = this.translate.instant('Dashboard.GreatestHour').replace('{0}', maxHour).replace('{1}', maxVal.toFixed(0));
    this.dashboardData.SmartInsights.push(maxHourTxt);
    const avg = (this.dashboardData.Hours.reduce((a, h) => a + (h.Amount || 0), 0) / this.dashboardData.Hours.length).toFixed(0);
    const avgTxt = this.translate.instant('Dashboard.AvgSalesPerHour').replace('{0}', avg);
    this.dashboardData.SmartInsights.push(avgTxt);
    const returnPercentageFromSales = ((this.dashboardData.Kpis.find(k => k.Type === KPIType.ReturnOrders)?.TotalAmount || 0) /
      (this.dashboardData.Kpis.find(k => k.Type === KPIType.Orders)?.TotalAmount || 1)) * 100;
    if (returnPercentageFromSales > 10) {
      const returnTxt = this.translate.instant('Dashboard.ReturnRate').replace('{0}', returnPercentageFromSales.toFixed(1));
      this.dashboardData.SmartInsights.push(returnTxt);
    } else {
      const stableTxt = this.translate.instant('Dashboard.GeneralPerformance');
      this.dashboardData.SmartInsights.push(stableTxt);
    }
  }

  applyFilters(){
    try{
      this.requestStarted = true;
      this.filters.Lang = this.language;
      // Call API endpoint (to be implemented on backend)
      this.dashboardService.getNewDashboard(this.filters).subscribe({
        next: (res: any) => {
          this.requestStarted = false;
          // Expecting response shape compatible with DashboardModel
          if(res){
            this.dashboardData = res as DashboardModel;
            this.handleData();
          }
        },
        error: (err) => {
          this.requestStarted = false;
          console.error('Failed to load dashboard with filters', err);
        }
      });
    }catch(e){
      this.requestStarted = false;
      console.error(e);
    }
  }

  get periodToLastPeriodTitle(): string {
    switch (this.filters.FilterType) {
      case 'weekly':
        return this.translate.instant('Dashboard.ThisWeekVsLastWeek');
      case 'monthly':
        return this.translate.instant('Dashboard.ThisMonthVsLastMonth');
      default:
        return this.translate.instant('Dashboard.TodayVsYesterday');
    }
  }
  get comparisonPaymentTitle(): string {
    
    return this.translate.instant('Dashboard.ComparingSalesByType').replace('{0}', this.periodToLastPeriodTitle );
  }
  get comparisonOrderTypeTitle(): string {
    return this.translate.instant('Dashboard.ComparingInvoiceTypes').replace('{0}', this.periodToLastPeriodTitle );
  }
  get periodTitle(): string {
    switch (this.filters.FilterType) {
      case 'weekly':
        return this.translate.instant('Dashboard.Week');
      case 'monthly':
        return this.translate.instant('Dashboard.Month');
      default:
        return this.translate.instant('Dashboard.Day');
    }
  }
  get lastPeriodTitle(): string {
    switch (this.filters.FilterType) {
      case 'weekly':
        return this.translate.instant('Dashboard.LastWeek');
      case 'monthly':
        return this.translate.instant('Dashboard.LastMonth');
      default:
        return this.translate.instant('Dashboard.Yesterday');
    }
  }
  get useSalesTarget(): boolean {
    return this.dashboardData.SalesTarget?.SalesTargetBranchs?.length > 0;
  }

}


