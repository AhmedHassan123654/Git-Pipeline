import { TaxModel } from "../order/TaxModel";

export class OrderTypeTaxModel {
  public DocumentId: string;
  public Id: number;
  public OrderTypeId: number;
  public TaxId: number;
  public TaxDocumentId: string;
  public Order: number;
  public TaxValue: number;
  public CompanyId: number;
  public IsDeleted: boolean;
  public IsSync: boolean;
  public Tax: TaxModel;
}
