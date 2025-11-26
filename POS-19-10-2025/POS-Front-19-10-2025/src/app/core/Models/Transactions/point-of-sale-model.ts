import { IncomingUserModel } from "./incoming-user-model";
import { NetworkPrinterDropDownModel } from "./network-printer-drop-down-model";
import { PricingClassDropDownModel } from "./PricingClassDropDownModel";
import { DynamicCombo } from "./dynamic-combo";

export class PointOfSaleModel {
  public DocumentId: string;
  public Id: number;
  public Name: string;
  public FName: string;
  public DeviceName: string;
  public IsTabletDevice: boolean;
  public WarhouseId: number;
  public CostCenterId: number;
  public PricingClassId: number;
  public StockId: number;
  public PrinterName: string;
  public IsHallPos: boolean;
  public IsMobilePos: boolean;
  public Authorized: boolean;
  public JsonFilePath: string;
  public AuthorizedToOther: boolean;
  public BranchId: number;
  public BranchName: string;
  public BranchDocumentId: string;
  public IsDeleted: boolean;
  public IsSync: boolean;
  public IsCallCenter: boolean;
  public ReceiveCallCenter: boolean;
  public LinkWithOnlineOrder: boolean;
  public CallCenterUrl: string;
  public OrdersSequenceFrom: number;
  public OrdersSequenceTo: number;
  public IncomingUserModels: IncomingUserModel[];
  public PricingClassDropDownModels: PricingClassDropDownModel[];
  public NetworkPrinterDropDownModels: NetworkPrinterDropDownModel[];
  public PricingClassList: DynamicCombo[];
  public NetworkPrinterList: DynamicCombo[];
  public ShowPinAfterPayment: boolean;

}
