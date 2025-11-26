export class OrderMasterTaxModel {
  public DocumentId: string;
  public Id: number;
  public OrderId: string;
  public TaxId: number;
  public TaxDocumentId: string;
  public TaxAmount: number;
  public TaxPercentage: number;
  public IsDeleted: boolean;
  public IsSync: boolean;
  public ServiceTaxType: number;
}
