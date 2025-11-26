import { ProductModel } from "./product-model";
import { PromoCustomModel } from "./promo-custom-model";
import { WorkDayModel } from "./WorkDayModel";

export class PromoModel {
  public Description: string;
  public DocumentId: string;
  public ValueType: number;
  public Value: number;
  public FromDate: Date;
  public ToDate: Date;
  public FromTime: Date;
  public ToTime: Date;
  public PromoCustomId: number;
  public CompanyId: number;
  public Products: ProductModel[];
  public PromoCustoms: PromoCustomModel;
  public WorkDays: Array<WorkDayModel>;
  public PaymentTypeList: string[];
  public PromoProducts: any = [];
  public OrderTypesList?: any = [];
  public OrderPayTypesList?: any = [];
}
