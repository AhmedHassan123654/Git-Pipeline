import { ProductModel } from "./product-model";

export class OrderDetailSubItemModel {
  public DocumentId: string;
  public Id: number;
  public OrderDetailId: string;
  public ProductSubItemId: number;
  public ProductSubItemDocumentId: string;
  public ProductSubItemName: string;
  public SingleQuantity: number = 0;
  public Price: number = 0;
  public RealPrice: number = 0;
  public ProductPrice: number = 0;
  public ProductFinalPrice: number = 0;
  public Notes: string;
  public TaxAmount: number = 0;
  public TaxPercentage: number;
  public TaxName: string;
  public TaxId: number;
  public TaxDocumentId: string;
  public IsCancelled: boolean;
  public CancellationReason: string;
  public Name: string;
  public ForeignName: string;
  public Total: number = 0;
  public IsDeleted: boolean;
  public IsSync: boolean;
  public levelIndex: number;
  public OrderDiscountValue: number;
  public DiscountAmount: number;
  public TaxDifferenceValue: number =0;
  public Quantity: number =0;
  IsMandatory:boolean=false;
}
