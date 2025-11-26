export class PromoCustomModel {
  public DocumentId: string;
  public Id: number;
  public CustomType: number;
  public ActualQuantity: number;
  public FreeQuantity: number;
  public ProductId: number;
  public ProductDocumentId: string;
  public ProductName: string;
  public ShowPromo: boolean;
  public ValueType: number;
  public IsDeleted: boolean;
  public IsSync: boolean;
  public PromoCustomId: number;
  public PromoCustomDocumentId: string;
}
export class PromoCustomsWithDetailModel {
  public DocumentId: string;
  public GetProductDocumentId: string;
  public GetProductVolumeDocumentId: string;
  public DiscountPercentage: number = undefined;
  public NewPrice: number = undefined;
}
