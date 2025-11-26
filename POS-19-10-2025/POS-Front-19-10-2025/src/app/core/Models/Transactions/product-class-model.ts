import { ProductModel } from "./product-model";
import { ProductGroupClassModel } from "./product-group-class-model";

export class ProductClassModel {
  public DocumentId: string;
  public Id: number;
  public Name: string;
  public ForiegnName: string;
  public CompanyId: number;
  public IsDeleted: boolean;
  public IsSync: boolean;
  public ProductModels: ProductModel[];
  public ProductClassModels: ProductGroupClassModel[];
}
