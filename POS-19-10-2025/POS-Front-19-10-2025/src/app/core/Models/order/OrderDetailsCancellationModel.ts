export class OrderDetailCancellationModel {
  public DocumentSerial: string;
  public ProductId: number;
  public ProductDocumentId: string;
  public ProductPrice: number;
  public ProductQuantity: number;
  public Printed: boolean;
  public ProductDone: boolean;
  public Barcode: string;
  public CancellationReasonId: number;
  public CancellationReasonDocumentId: string;
  public CancellationReasonName: string;
  public StationId: number;
  public ProductFinalPrice: number;
  public VolumeId: number;
  public TaxAmount: number;
  public TaxPercentage: number;
  public SizeId: number;
  public ParentOrderDetailId: number;
  public OrderDetailId: string;
  public IsPromo: boolean;
  public CompanyId: number;
}
