import { ProductPricingClassModel } from "./ProductPricingClassModel";

export class PricingClassModel {
  public DocumentId: string;
  public Id: number;
  public Name: string;
  public FerpCode?: string;
  public ForeignName: string;
  public CompanyId: number;
  public POSProductPricingClasses: ProductPricingClassModel[];
}
