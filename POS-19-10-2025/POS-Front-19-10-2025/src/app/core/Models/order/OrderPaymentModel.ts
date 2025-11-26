export class OrderPaymentModel {
  public PayTypeId: number;
  public PayTypeName: string;
  public OrderId: string;
  public CustomerId: number;
  public Amount: number;
  public PayAmount: number;
  // public VisaCommissionAmount:number;
  public PayTypeDocumentId: string;
  public PaymentSystemDocumentId: string;
  public ReservationPayment: boolean;
  public PayType?: number;
  public Note?: string;
}
