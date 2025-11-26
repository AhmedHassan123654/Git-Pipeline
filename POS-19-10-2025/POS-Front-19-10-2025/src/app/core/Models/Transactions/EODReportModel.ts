export class EODReportModel {
  public DocumentId: string;
  public Id: number;
  public CreateTime: string;
  public CreatorUserId: number;
  public CashierName: string;
  public Amount?: number;
  public RTAmount?: number;
  public AmountVisa?: number;
  public AmountCash?: number;
  public AmountDelay?: number;
  public RTAmountVisa?: number;
  public RTAmountCash?: number;
  public RTAmountDelay?: number;
  public CRAmount?: number;
  public EEAmount?: number;
  public PayTypeName: string;
  public PayType?: number;
  public Type: string;
  public date: string;
  public deficit: any;
  public ReceiveCashCashier: any;
  IsSync?: boolean;
}
