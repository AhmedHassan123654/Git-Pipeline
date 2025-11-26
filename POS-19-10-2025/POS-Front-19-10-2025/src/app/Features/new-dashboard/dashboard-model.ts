export class DashboardModel {
    Kpis: KPI[] = [];
    OrdersCompare: Comparison[] = [];
    OrderTypesCompare: Comparison[] = [];
    Hours: HourModel[] = [];
    SmartInsights?: string[] = [];
    TopProducts?: Record<string, number> = {};
    TopBranches?: Record<string, number>= {};
    UserSales?: Record<string, number>= {};
    SalesTarget?:POSSalesMonthlyTarget; 
}
export class HourModel{
    Hour?: string;
    Count?: number;
    Amount?: number;
    Discount?: number
}
export class KPI{
  Payments: { PayName: string; Amount: number; PayType?: PayTypes; Icon?: string }[] = [];
  TotalAmount?: number = 0;
  Count?: number = 0;
  Name?:string = '';
  Type?:KPIType;
  BorderClass?:string = '';
}
export class Comparison {
    // Type?: PayTypes
    Name?: string;
    OrdersForPerid?: number;
    OrdersLastPerid?: number;
    Icon?: string;
    Percentage?: number;
    Color?: string = '';
}
export enum PayTypes
{
    Cash = 10,
    Credit = 20,
    Visa = 30,
    //CashAndVisa = 40,
    Free = 50,
    CashBack = 70
}
export enum KPIType{
    Orders = 1,
    ReturnOrders = 2,
    NetSales = 3,
    CashReceipt = 4,
    ExtraExpenses = 5
}
export class DashboardFilters{
    FilterType?: 'daily' | 'weekly' | 'monthly';
    Date?: string;   // yyyy-MM-dd
    Week?: string;   // yyyy-ww (HTML week input value)
    Month?: string;  // yyyy-MM
    Lang?: string = 'en';
}

export class POSSalesMonthlyTarget {
    PeriodDate:string ;
    PeriodName:string ;
    PerionType:SalesTargetPerionType ;
    SalesTargetBranchs : POSSalesTargetBranches[]= [] ;

}
export class POSSalesTargetBranches
{
    BranchName:string ;
    BranchDocumentId:string ;
    TargetAmount :number;
    Percentage :number;
    TargetActualAmount :number;
}
export enum SalesTargetPerionType
{
    Month
}