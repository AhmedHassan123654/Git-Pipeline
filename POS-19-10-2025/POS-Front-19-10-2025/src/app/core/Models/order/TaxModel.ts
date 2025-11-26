import { ProductModel } from "../Transactions/product-model";
export class TaxModel {
  public Name: string;
  public DocumentId: string;
  public Id: number;
  public ForeignName: string;
  public TaxCode: string;
  //public Type : TaxTypes
  public ValueType: number;
  public Value: number;
  public AccountId: number;
  public HasVATTax: boolean;
  public IncludeOtherTaxes: boolean;
  public VATTaxId: number;
  public CompanyId: number;
  public ProductModels: ProductModel[];
  public VATTax: TaxModel;
  // public VatTaxesDetailModels : VatTaxesDetailModel[]
  public IncludedVATTaxes: TaxModel[];
  public MinimumValue: number;
  public ExtraTax: boolean;
}
