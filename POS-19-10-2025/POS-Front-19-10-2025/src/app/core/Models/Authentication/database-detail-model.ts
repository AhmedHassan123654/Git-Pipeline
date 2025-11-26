export class DatabaseDetailModel {
  public ServerName: string;
  public DatabaseName: string;
  public AuthenticationType: string;
  public IsWithImages: boolean;
  public UserName: string;
  public Password: string;
  public IsPull: boolean;
  public PushTime: string;
  public PushDuration: string;
  public PullTime: string;
  public PullDuration: string;
  public PullProductsTime: string;
  public PullProductsDuration: string;
  public PullCustomersTime: string;
  public PullCustomersDuration: string;
  public PullStockItemsTime: string;
  public PullStockItemsDuration: string;
  public FerpUrl: string;
  public PushUrl: string;
  public TenantId: string;

  public BranchId: number;
  public FinancialSystem: number;
  public Pull: number;
  public Push: number;
  public PushMintes: number;
  public ListOfTimes: any;
  public IsMain: boolean;
}
