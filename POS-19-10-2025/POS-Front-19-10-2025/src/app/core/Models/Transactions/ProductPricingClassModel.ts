import { ProductPricingClassVolumeModel } from "./ProductPricingClassVolumeModel";

export class ProductPricingClassModel {
  public DocumentId: string;
  public Id: number;
  public ProductId: number;
  public PricingClassId: number;
  public Price: number;
  public ProductDocumentId: string;
  public ProductName: string;
  public PricingClassDocumentId: string;
  public PricingClassName: string;
  public CompanyId: number;
  public IsVolume: boolean;
  public ProductGroupDocumentId: string;
  public ProductGroupName: string;
  public Selected: boolean;
  public ProductPricingClassVolumes: ProductPricingClassVolumeModel[];
}
