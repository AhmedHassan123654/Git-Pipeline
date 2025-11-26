import { ProductModel } from "./product-model";
import { ProductClassModel } from "./product-class-model";
import { ProductGroupClassModel } from "./product-group-class-model";

export class ProductGroupModel {
  public DocumentId: string;
  public Id: number;
  public Code: string;
  public Name: string;
  public ForiegnName: string;
  public PicturePath: string;
  public PricingClassId: number;
  public ProductTypeId: number;
  public ProductTypeDocumentId: string;
  public StockId: number;
  public SalesAccountId: number;
  public ReturnSalesAccountId: number;
  public DiscountAccountId: number;
  public CostCenterId: number;
  public PrintInCashierPrinter: boolean;
  public BranchId: number;
  public IsDeleted: boolean;
  public IsSync: boolean;
  public Selected: boolean;
  public Products: ProductModel[];
  public ProductGroupClassModels: ProductGroupClassModel[];
}
