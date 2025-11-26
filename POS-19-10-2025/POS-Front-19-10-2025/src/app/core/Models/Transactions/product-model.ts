import { ProductVolumeModel } from "./product-volume-model";
import { ProductSubItemModel } from "./product-sub-item-model";
import { NoteModel } from "./note-model";
import { PromoCustomModel } from "./promo-custom-model";
import { TaxModel } from "../order/TaxModel";
import { ProductPricingClassModel } from "./ProductPricingClassModel";
import { PromoModel } from "./PromoModel";

export class ProductModel {
  public DocumentId: string;
  public Id: number;
  public Price: number;
  public ProductNumber: string;
  public Name: string;
  public ForiegnName: string;
  public ShortName: string;
  public Description: string;
  public PicturePath: string;
  public Color: string;
  public Order: number;
  public UseWeights: boolean;
  public Barcode: string;
  public ProductPeriodTime: number;
  public IsCombo: boolean;
  public ProductTypeId: number;
  public ProductClassId: number;
  public ProductGroupId: number;
  public ProductGroupDocumentId: string;
  public ProductGroupName: string;
  public IsSubItem: boolean;
  public IsMinimumCharge: boolean;
  public TaxId: number;
  public TaxDocumentId: string;
  public TaxValue: number;
  public ShowVat: boolean;
  public DiscountValue: number;
  public ShowDiscount: boolean;
  public RequestLimit: number;
  public AllowChangePrice: boolean;
  public PriceChanged: boolean;
  public IsStopped: boolean;
  public StockEffect: number;
  public FromSearch: boolean;
  public CompanyId: number;
  public IsDeleted: boolean;
  public IsSync: boolean;
  public Tax: TaxModel;
  public AvailableQuantity: number;
  public InActive: boolean;
  public Selected: boolean;
  public ProductCodeGTIN: string;
  public ProductCodeHSN: string;
  public ProductVolumes: ProductVolumeModel[];
  public ProductSubItems: ProductSubItemModel[];
  public ProductItems: any[];
  public Notes: NoteModel[];
  public ProductPricingClasses: ProductPricingClassModel[];
  public Promos: PromoModel[];
  public PromoCustoms: PromoCustomModel;
  public ProductProperties: any;
  public IndexInGroup: number;
  public NumberOfSideDishesAllowed: number;
  public MinNumberOfSideDishesAllowed: number;
  public DefaultQuantity: number;
  public IsVolume: boolean = false;
  public Checked: boolean = false;
  public AsGroupMeal: boolean = false;
  public VolumeId: number = null;
  public VolumeDocumentId: string;
  public VolumeFerpCode: string;
  public ProductVolumeName: string;
  public GroupMealName: string;
  public EntertainmentService:boolean;
  public ProductSuggestions: any[];
  public ProductTaxes : any[];
  public Meals : any[];
  public Combos : Combo[];

}
export class ProductInsertResponse {
  Success: boolean;
  errors?: string[]; // Assuming errors is an optional property that contains an array of error messages
}
export class Combo {
public ProductId? : number ;
public ProductDocumentId : string ;
public ComboProductId? : number ;
public ComboProductDocumentId : string ;
public ComboProductName : string ;
public ComboProductPrice : number ;
}

