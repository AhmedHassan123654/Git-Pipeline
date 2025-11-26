import { StockModel } from "./stockModel";
import { CancellationReasonModel } from "./cancellationReasonModel";
import { OrderDetailModel } from "../Transactions/order-detail-model";
import { ReturnOrderDetailTaxModel } from "./ReturnOrderDetailTaxModel";

export class ReturnOrderDetailModel {
  public DocumentId: string = "";
  public Id: number;
  public BranchId: number;
  public ReturnOrderId: string;
  public OrderDetailId: string;
  public ReturnedQuantity: number = 0;
  public ProductQuantity: number;
  public ProductName: string;
  public CancellationReason: string;
  public ProductDocumentId: string;
  public ProductId: number;
  public ProductPrice: number;
  public ProductFinalPrice: number;
  public TaxAmount: number;
  public DiscountAmount: number;
  public ServiceChargeValue: number;
  public VolumeId: number;
  public VolumeDocumentId: string;
  public ReturnReasonDetail: string;
  public Ischecked: boolean;
  public ReturnOrderTotal: number;
  public RemaindQuantity: number;
  public IsPromo: boolean;
  public IsSideDishes: boolean;
  public IsDisabled: boolean;
  public MyNum: number;
  public RealPrice: number;
  public ServiceChargeTaxAmount: number;
  public UseWeights: boolean;
  public OrderDetailDocumentId: string;
  public ProductVolumName: string;
  public ReturnOrderDetailTaxes: ReturnOrderDetailTaxModel[];


  // only front
  OrderNumber:number;
}
