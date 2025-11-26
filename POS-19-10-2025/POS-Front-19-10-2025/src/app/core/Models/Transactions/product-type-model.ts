import { ProductGroupModel } from "./product-group-model";
import { SettingModel } from "./setting-model";

export class ProductTypeModel {
  public DocumentId: string;
  public Id: number;
  public Name: string;
  public ForeignName: string;
  public CompanyId: number;
  public IsDeleted: boolean;
  public IsStopped: boolean;
  public IsSync: boolean;
  public HideProductGroupsInOrder: boolean;
  public SettingModel: SettingModel;
  public ProductGroups: ProductGroupModel[];
}
